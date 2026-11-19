/**
 * SPM PNG Studio™ - In-Memory Standards-Compliant ZIP Archive Builder
 * Zero third-party dependencies; builds valid ZIP files directly in browser ArrayBuffers.
 * SPManchester Private Limited (https://www.spmanchester.com)
 */

import { asciiBytes, joinBytes } from './utils.js';

export function crc32(bytes) {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc ^= bytes[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

const u16 = (v) => {
  const a = new Uint8Array(2);
  new DataView(a.buffer).setUint16(0, v, true);
  return a;
};

const u32 = (v) => {
  const a = new Uint8Array(4);
  new DataView(a.buffer).setUint32(0, v, true);
  return a;
};

export async function createZipBlob(entries) {
  const parts = [];
  const central = [];
  let offset = 0;

  for (const item of entries) {
    const name = asciiBytes(item.name);
    const data = new Uint8Array(await item.blob.arrayBuffer());

    if (data.length > 0xffffffff) {
      throw new Error(`File ${item.name} exceeds 4GB ZIP boundary`);
    }

    const crc = crc32(data);
    const length = data.length;

    // Local file header (PK\x03\x04)
    const local = joinBytes([
      u32(0x04034b50),
      u16(20),       // Version needed: 2.0
      u16(0x0800),   // General purpose flags: UTF-8 filename
      u16(0),        // Compression: Store (0)
      u16(0),        // Last mod file time
      u16(0),        // Last mod file date
      u32(crc),      // CRC-32
      u32(length),   // Compressed size
      u32(length),   // Uncompressed size
      u16(name.length), // Filename length
      u16(0),        // Extra field length
      name
    ]);

    parts.push(local, data);

    // Central directory header (PK\x01\x02)
    central.push(
      joinBytes([
        u32(0x02014b50),
        u16(20),     // Version made by
        u16(20),     // Version needed
        u16(0x0800), // Flags: UTF-8
        u16(0),      // Compression: Store
        u16(0),      // Time
        u16(0),      // Date
        u32(crc),
        u32(length),
        u32(length),
        u16(name.length),
        u16(0),      // Extra length
        u16(0),      // File comment length
        u16(0),      // Disk number start
        u16(0),      // Internal file attributes
        u32(0),      // External file attributes
        u32(offset), // Relative offset of local header
        name
      ])
    );

    offset += local.length + data.length;
  }

  const centralBytes = joinBytes(central);
  const centralLength = centralBytes.length;

  // End of central directory record (PK\x05\x06)
  const end = joinBytes([
    u32(0x06054b50),
    u16(0),               // Number of this disk
    u16(0),               // Disk where central directory starts
    u16(entries.length),  // Number of central directory records on this disk
    u16(entries.length),  // Total number of central directory records
    u32(centralLength),   // Size of central directory
    u32(offset),          // Offset of start of central directory
    u16(0)                // Comment length
  ]);

  return new Blob([...parts, centralBytes, end], { type: 'application/zip' });
}
