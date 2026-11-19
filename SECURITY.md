# Security Policy

At **SPManchester Private Limited**, we take software security and data privacy with utmost seriousness. **SPM PNG Studio™** is architected on a fundamental privacy-first principle: **all image processing occurs locally on the client device**.

---

## Supported Versions

We provide security updates and patches for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

---

## Core Privacy & Security Architecture

1. **Zero Data Transmission:**
   - Source images, converted files, file names, and dimensions are processed in the user's browser memory via the HTML5 Canvas API and Web Workers.
   - No telemetry, analytics payloads, or external API endpoints receive user image binaries.

2. **No Remote Code Execution:**
   - The application does not use `eval()` or unsanitized DOM manipulation.
   - SVG outputs are wrapped strictly in clean XML envelopes without embedded executable JavaScript blocks (`<script>`).

3. **Memory Management:**
   - In-memory image references (`URL.createObjectURL`) are systematically revoked upon queue clearance or after ZIP generation to prevent browser memory leaks.

---

## Reporting a Vulnerability

If you discover a security vulnerability or potential privacy issue in this repository, please do **NOT** open a public issue.

Please report the vulnerability directly to the SPManchester Security Team:

- **Security Email:** [info@spmanchester.com](mailto:info@spmanchester.com)
- **Subject Line:** `[SECURITY] SPM PNG Studio Vulnerability Report`
- **Lead Contact:** Sayed Mudassar Akbar

### What to Include in Your Report

To help us investigate and remediate quickly, please include:
- A detailed description of the vulnerability.
- Proof of Concept (PoC) code or step-by-step reproduction instructions.
- Potential impact and affected browsers/environments.
- Any suggested remediation or patch.

### Our Commitment

- We will acknowledge receipt of your vulnerability report within **48 hours**.
- We will provide a formal assessment and timeline for a fix within **5 business days**.
- Once a fix is verified, we will publish a release and credit your contribution (if desired).

---

## Legal & Compliance

SPM PNG Studio™ is maintained and governed by **SPManchester Private Limited**.  
Website: [www.spmanchester.com](https://www.spmanchester.com)
