/**
 * SPM PNG Studio™ - Windows ICO Binary Encoder
 * SPManchester Private Limited (https://www.spmanchester.com)
 */

export async function canvasToIcoBlob(canvas) {
  const iconCanvas = document.createElement('canvas');
  iconCanvas.width = 256;
  iconCanvas.height = 256;
  const ctx = iconCanvas.getContext('2d');

  // Scale keeping aspect ratio inside 256x256 bounding box
  const scale = Math.min(256 / canvas.width, 256 / canvas.height);
  const w = Math.round(canvas.width * scale);
  const h = Math.round(canvas.height * scale);

  ctx.drawImage(canvas, (256 - w) / 2, (256 - h) / 2, w, h);

  const pngBlob = await new Promise((resolve) => iconCanvas.toBlob(resolve, 'image/png'));
  const pngBytes = new Uint8Array(await pngBlob.arrayBuffer());

  const out = new Uint8Array(22 + pngBytes.length);
  const view = new DataView(out.buffer);

  // ICONDIR header
  view.setUint16(0, 0, true);  // Reserved (must be 0)
  view.setUint16(2, 1, true);  // Resource type: 1 = ICO
  view.setUint16(4, 1, true);  // Image count: 1

  // ICONDIRENTRY (Entry 0)
  out[6] = 0;                  // Width: 0 means 256px
  out[7] = 0;                  // Height: 0 means 256px
  out[8] = 0;                  // Color palette: 0 = no palette
  out[9] = 0;                  // Reserved
  view.setUint16(10, 1, true); // Color planes
  view.setUint16(12, 32, true);// Bits per pixel (32-bit RGBA)
  view.setUint32(14, pngBytes.length, true); // Size of image data in bytes
  view.setUint32(18, 22, true);              // Offset of image data from beginning of file

  // Append PNG data payload
  out.set(pngBytes, 22);

  return new Blob([out], { type: 'image/x-icon' });
}
