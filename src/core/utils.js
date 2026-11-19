/**
 * SPM PNG Studio™ - Utility Functions
 * Maintained by SPManchester Private Limited (https://www.spmanchester.com)
 * Lead Maintainer: Sayed Mudassar Akbar
 */

export const readableBytes = (bytes) => {
  if (bytes > 1048576) {
    return (bytes / 1048576).toFixed(2) + ' MB';
  }
  return (bytes / 1024).toFixed(1) + ' KB';
};

export const escapeHTML = (str) =>
  String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));

export const asciiBytes = (text) => new TextEncoder().encode(text);

export const joinBytes = (arrays) => {
  const total = arrays.reduce((acc, curr) => acc + curr.length, 0);
  const result = new Uint8Array(total);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
};

export const dataURLtoBlob = (data) => {
  const match = /^data:([^;,]+)?(;base64)?,([\s\S]*)$/i.exec(data.trim());
  if (!match) {
    throw new Error('Please provide a valid Base64 data URL (e.g. data:image/png;base64,...)');
  }
  const mime = match[1] || 'image/png';
  if (!/^image\/(?:png|jpeg|jpg|webp|gif|bmp|svg\+xml|avif|x-icon|vnd\.microsoft\.icon)$/.test(mime)) {
    throw new Error('Data URL must represent an image format.');
  }
  const raw = match[2] ? atob(match[3].replace(/\s/g, '')) : decodeURIComponent(match[3]);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    arr[i] = raw.charCodeAt(i);
  }
  return new Blob([arr], { type: mime });
};
