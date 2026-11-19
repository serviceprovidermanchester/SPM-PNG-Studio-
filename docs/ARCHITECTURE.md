# Architecture & Technical Design

**SPM PNG Studio™** is an enterprise-grade, privacy-first image transformation suite architected by **SPManchester Private Limited** under the leadership of **Sayed Mudassar Akbar**.

---

## 1. Architectural Philosophy

Traditional web image converters upload user files to a cloud server, transcode them with headless utilities (e.g., ImageMagick, Sharp, FFmpeg), and return download links. This model introduces critical security risks:
- Risk of sensitive document interception in transit.
- Cold-storage data leakages on third-party servers.
- Latency incurred by high-bandwidth network payloads.

**SPM PNG Studio** eliminates server dependency entirely:
- **100% In-Browser Execution:** Transcoding runs in the client browser's JavaScript execution thread, leveraging Hardware-Accelerated Canvas2D APIs and TypedArrays.
- **Zero Telemetry / Zero Storage:** No file bytes, hashes, names, or metadata are ever transmitted across the network.
- **Microsecond Memory Allocation:** Blobs and Object URLs are systematically freed using `URL.revokeObjectURL()` to prevent memory spikes on mobile and desktop devices.

---

## 2. High-Level System Architecture

```mermaid
flowchart TD
    subgraph Client["User Device (Browser Engine)"]
        A["PNG Input (File Picker / Drag & Drop / Base64)"] --> B["Image Decoder (HTMLImageElement)"]
        B --> C["Transformation Pipeline"]
        
        subgraph Pipeline["Canvas2D Transformation Pipeline"]
            C --> D["Aspect-Ratio Resizer (100%, 75%, 50%, Custom)"]
            D --> E{"Target Format Selector"}
            
            E -->|JPG / WEBP| F["Native Canvas Encoder (with Quality Control)"]
            E -->|BMP| G["Binary BMP 24-bit Encoder (DIB / BITMAPINFOHEADER)"]
            E -->|ICO| H["Windows ICO Multi-Res Encoder (256x256 ICONDIR)"]
            E -->|PDF| I["Vector PDF-1.4 Stream Encoder (A4 Margin Scaling)"]
            E -->|SVG| J["XML Vector Envelope (Embedded Lossless Base64)"]
            E -->|BASE64| K["Data URL Serializer (text/plain)"]
        end
        
        F --> L["In-Memory Blob Store"]
        G --> L
        H --> L
        I --> L
        J --> L
        K --> L
        
        L --> M["Direct Single File Download"]
        L --> N["In-Memory Streaming ZIP Packer (PKZIP 2.0 + CRC-32)"]
        N --> O["Instant ZIP Archive Download"]
    end
```

---

## 3. Data Processing Pipeline

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant UI as DOM Interface
    participant Engine as Conversion Engine
    participant Canvas as Canvas2D Subsystem
    participant Bin as Binary / ArrayBuffer Encoders
    participant ZIP as In-Memory ZIP Builder

    User->>UI: Select PNG images or drop files
    UI->>Engine: Validate file size (<= 25MB) & MIME type
    Engine-->>UI: Render thumbnail & file metadata in queue

    User->>UI: Select Target Format (e.g., JPG, WebP, PDF) & Dimensions
    User->>UI: Click "Convert"
    UI->>Engine: Trigger batch conversion loop

    loop For Each Queued Image
        Engine->>Canvas: Decode image & calculate target dimensions
        alt Lossy / Target lacks Alpha
            Canvas->>Canvas: Pre-fill background (#ffffff)
        end
        Canvas->>Canvas: Draw scaled pixels
        alt Native Format (JPG, WebP, PNG)
            Canvas->>Engine: canvas.toBlob(mime, quality)
        else Binary Format (BMP, ICO, PDF, SVG)
            Canvas->>Bin: Extract raw RGBA bytes / ImageData
            Bin->>Bin: Format header + pixel array
            Bin->>Engine: Construct Blob([Uint8Array])
        end
        Engine-->>UI: Update real-time progress status
    end

    UI->>UI: Display converted items list with instant download buttons
    User->>UI: Click "Download All as ZIP"
    UI->>ZIP: Pass array of {name, blob}
    ZIP->>ZIP: Calculate CRC-32 checksums & write PKZIP headers
    ZIP-->>UI: Output single application/zip Blob
    UI->>User: Trigger direct file download
```

---

## 4. Binary Encoders Specification

### 4.1. BMP 24-bit RGB Encoder (`src/core/bmp.js`)
- Standard 54-byte header consisting of `BITMAPFILEHEADER` (14 bytes) and `BITMAPINFOHEADER` (40 bytes).
- Row stride padded to 4-byte boundaries: `stride = w * 3 + (4 - (w * 3) % 4) % 4`.
- Pixel scanning inverted vertically (bottom-up scan) and mapped to `BGR` byte order.

### 4.2. Windows ICO Encoder (`src/core/ico.js`)
- Follows Windows Icon Resource format (`ICONDIR` + `ICONDIRENTRY`).
- Resizes source image into a 256x256 bounding box maintaining aspect ratio.
- Encapsulates lossless PNG data stream directly into the icon entry payload.

### 4.3. Pure In-Browser PDF-1.4 Generator (`src/core/pdf.js`)
- Embeds compressed DCT/JPEG byte streams into standard PDF indirect objects (`Catalog`, `Pages`, `Page`, `XObject`, `Contents`).
- Auto-scales high-resolution images within standard A4 print dimensions (`595.28 x 841.89 pt`) with balanced 28pt safety margins.

### 4.4. In-Memory ZIP Packer (`src/core/zip.js`)
- Pure JavaScript PKZIP 2.0 implementation without external dependencies like JSZip.
- Uses tableless hardware-friendly bitwise polynomial (`0xEDB88320`) for CRC-32 computation.
- Generates Local File Headers, Central Directory Records, and End of Central Directory (EOCD) records directly into a single contiguous `Blob`.

---

## 5. Security & Isolation

- **No Third-Party Analytics Trackers:** No tracking scripts or external telemetry libraries.
- **CSP Compliant:** Nginx container configurations include strict `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, and `X-Frame-Options: SAMEORIGIN`.
- **Memory Safety:** Image data URLs created for thumbnails are immediately released via `URL.revokeObjectURL(url)` upon DOM render or queue clearance.

---

## 6. Corporate Attribution
- **Company:** SPManchester Private Limited
- **Website:** [www.spmanchester.com](https://www.spmanchester.com)
- **Lead Maintainer:** Sayed Mudassar Akbar
- **Contact:** [info@spmanchester.com](mailto:info@spmanchester.com)
