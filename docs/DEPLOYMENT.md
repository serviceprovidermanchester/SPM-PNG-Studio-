# Enterprise Deployment Guide

**SPM PNG Studio™** is designed for zero-config, static hosting across any CDN, cloud provider, or on-premise container cluster.

---

## 1. GitHub Pages (Automated CI/CD)

The repository includes a ready-to-run GitHub Actions workflow in [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml).

1. Push this repository to your GitHub account (e.g. `https://github.com/serviceprovidermanchester/SPM-PNG-Studio-`).
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Every push to the `main` branch will automatically build and publish the latest version of the suite at:
   ```text
   https://serviceprovidermanchester.github.io/SPM-PNG-Studio-/
   ```

---

## 2. Docker Container Deployment

For private intranets, isolated VPCs, or enterprise on-premises networks:

### Run with Docker CLI

```bash
# Build the Docker image
docker build -t spmanchester/png-studio:latest .

# Run container on port 8080
docker run -d -p 8080:80 --name spm-png-studio spmanchester/png-studio:latest
```

Open `http://localhost:8080` in your browser.

### Run with Docker Compose

```bash
docker-compose up -d
```

---

## 3. Cloudflare Pages / Vercel / Netlify

Because SPM PNG Studio is 100% static:

- **Build Command:** *(Leave blank or `npm run build`)*
- **Output Directory:** `.` (root directory)
- **Node.js Version:** 18.x or 20.x

---

## 4. Production Nginx Configuration

A hardened Nginx configuration is provided in [`nginx.conf`](../nginx.conf):
- HTTP Strict Transport Security (HSTS) headers.
- Content Security Policy (CSP) blocking external unauthorized execution.
- Gzip compression enabled for all static text and XML assets.
- Asset caching for 7 days (`Cache-Control: public, no-transform`).

---

## Governance & Attribution

- **Company:** SPManchester Private Limited
- **Official Website:** [www.spmanchester.com](https://www.spmanchester.com)
- **Lead Maintainer:** Sayed Mudassar Akbar
- **Contact:** [info@spmanchester.com](mailto:info@spmanchester.com)
