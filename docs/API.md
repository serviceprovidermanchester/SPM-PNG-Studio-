# SPM PNG Studio™ — API & SDK Documentation

**SPM PNG Studio** can be integrated programmatically as an ES Module into modern frontend applications (React, Vue, Svelte, Angular, Vite, Next.js client components).

---

## Installation

```bash
npm install @spmanchester/png-studio
```

---

## Core Module Exports

```javascript
import {
  convertSingleImage,
  calculateDimensions,
  createZipBlob,
  dataURLtoBlob,
  readableBytes,
  EXT,
  MIME
} from '@spmanchester/png-studio';
```

---

## 1. `convertSingleImage(options)`

Converts a single image `File` or `Blob` into the requested target format.

### Parameters

| Option | Type | Default | Description |
|---|---|---|---|
| `file` | `File` \| `Blob` | *Required* | Input PNG image file |
| `targetFormat` | `string` | `'JPG'` | Target format: `'JPG'`, `'WEBP'`, `'SVG'`, `'PDF'`, `'ICO'`, `'BMP'`, `'BASE64'` |
| `scaleOrCustom`| `number` \| `'custom'` | `1` | Scale multiplier (`1`, `0.75`, `0.5`, `0.25`) or `'custom'` |
| `customWidth` | `number` | `1200` | Target width in pixels if `scaleOrCustom` is `'custom'` |
| `quality` | `number` | `0.9` | Compression quality (`0.4` to `1.0`) for JPG, WebP, and PDF |

### Returns

A Promise resolving to an object:

```typescript
interface ConversionResult {
  blob: Blob;
  name: string;
  width: number;
  height: number;
  format: string;
  size: number;
}
```

### Usage Example

```javascript
import { convertSingleImage } from '@spmanchester/png-studio';

const fileInput = document.getElementById('my-file');

fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];

  const result = await convertSingleImage({
    file,
    targetFormat: 'WEBP',
    quality: 0.85,
    scaleOrCustom: 0.5 // Scale down to 50%
  });

  console.log(`Converted: ${result.name} (${result.width}x${result.height}, ${result.size} bytes)`);

  // Download converted file
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(result.blob);
  downloadLink.download = result.name;
  downloadLink.click();
});
```

---

## 2. `createZipBlob(entries)`

Bundles an array of files into an in-memory ZIP archive with valid PKZIP 2.0 structure.

### Parameters

- `entries`: Array of `{ name: string, blob: Blob }`

### Returns

- `Promise<Blob>`: A Blob of type `application/zip`.

### Usage Example

```javascript
import { createZipBlob } from '@spmanchester/png-studio';

const zipBlob = await createZipBlob([
  { name: 'photo-1.jpg', blob: blob1 },
  { name: 'photo-2.jpg', blob: blob2 }
]);

const downloadUrl = URL.createObjectURL(zipBlob);
```

---

## 3. `calculateDimensions(w, h, scaleOrCustom, customWidth)`

Calculates output dimensions while strictly preserving aspect ratio and preventing memory overconsumption (> 36 Megapixels).

```javascript
import { calculateDimensions } from '@spmanchester/png-studio';

const dims = calculateDimensions(3840, 2160, 'custom', 1920);
// Returns: { width: 1920, height: 1080 }
```

---

## Enterprise Support

- **SPManchester Private Limited**
- **Website:** [www.spmanchester.com](https://www.spmanchester.com)
- **Author:** Sayed Mudassar Akbar
- **Email:** [info@spmanchester.com](mailto:info@spmanchester.com)
