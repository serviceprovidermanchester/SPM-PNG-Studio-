/**
 * SPM PNG Studio™ - Lightweight In-Browser PDF Generator
 * Embeds compressed JPEG/PNG streams into clean PDF-1.4 documents without external bloat.
 * SPManchester Private Limited (https://www.spmanchester.com)
 */

import { asciiBytes } from './utils.js';

export async function canvasToPdfBlob(canvas, quality = 0.92) {
  const jpegBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
  const jpeg = new Uint8Array(await jpegBlob.arrayBuffer());

  const width = canvas.width;
  const height = canvas.height;
  const pageW = 595.28; // Standard A4 width in pt
  const pageH = 841.89; // Standard A4 height in pt
  const margin = 28;

  const scale = Math.min((pageW - 2 * margin) / width, (pageH - 2 * margin) / height);
  const w = width * scale;
  const h = height * scale;
  const x = ((pageW - w) / 2).toFixed(2);
  const y = ((pageH - h) / 2).toFixed(2);

  const content = asciiBytes(`q\n${w.toFixed(2)} 0 0 ${h.toFixed(2)} ${x} ${y} cm\n/Im1 Do\nQ\n`);

  const segments = [];
  const offsets = [0];
  let pos = 0;

  function append(data) {
    segments.push(data);
    pos += data.length;
  }

  function addObj(num, parts) {
    offsets[num] = pos;
    append(asciiBytes(`${num} 0 obj\n`));
    for (const part of parts) {
      append(typeof part === 'string' ? asciiBytes(part) : part);
    }
    append(asciiBytes('\nendobj\n'));
  }

  append(asciiBytes('%PDF-1.4\n%\xD0\xD0\xD0\xD0\n'));
  addObj(1, ['<< /Type /Catalog /Pages 2 0 R >>']);
  addObj(2, ['<< /Type /Pages /Kids [3 0 R] /Count 1 >>']);
  addObj(3, [
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>`
  ]);
  addObj(4, [
    `<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`,
    jpeg,
    '\nendstream'
  ]);
  addObj(5, [`<< /Length ${content.length} >>\nstream\n`, content, 'endstream']);

  const xref = pos;
  append(asciiBytes('xref\n0 6\n0000000000 65535 f \n'));
  for (let i = 1; i <= 5; i++) {
    append(asciiBytes(String(offsets[i]).padStart(10, '0') + ' 00000 n \n'));
  }

  append(asciiBytes(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`));

  return new Blob(segments, { type: 'application/pdf' });
}
