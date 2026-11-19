/**
 * SPM PNG Studio™ - BMP Binary Encoder (24-bit uncompressed RGB)
 * SPManchester Private Limited (https://www.spmanchester.com)
 */

export function canvasToBmpBlob(canvas) {
  const w = canvas.width;
  const h = canvas.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const rgba = ctx.getImageData(0, 0, w, h).data;

  // Stride must be padded to a multiple of 4 bytes
  const stride = w * 3 + (4 - (w * 3) % 4) % 4;
  const bytes = new Uint8Array(54 + stride * h);
  const view = new DataView(bytes.buffer);

  // Bitmap File Header
  bytes[0] = 0x42; // 'B'
  bytes[1] = 0x4d; // 'M'
  view.setUint32(2, bytes.length, true); // File size
  view.setUint32(10, 54, true);          // Offset to pixel array

  // DIB Header (BITMAPINFOHEADER)
  view.setUint32(14, 40, true);          // Header size
  view.setInt32(18, w, true);            // Image width
  view.setInt32(22, h, true);            // Image height (positive = bottom-up)
  view.setUint16(26, 1, true);           // Color planes
  view.setUint16(28, 24, true);          // Bits per pixel (24-bit RGB)
  view.setUint32(34, stride * h, true);  // Raw bitmap data size

  // Write BGR pixels bottom-to-top
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const src = (y * w + x) * 4;
      const dst = 54 + (h - y - 1) * stride + x * 3;
      bytes[dst]     = rgba[src + 2]; // Blue
      bytes[dst + 1] = rgba[src + 1]; // Green
      bytes[dst + 2] = rgba[src];     // Red
    }
  }

  return new Blob([bytes], { type: 'image/bmp' });
}
