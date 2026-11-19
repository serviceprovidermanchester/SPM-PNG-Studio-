# Contributing to SPM PNG Studio™

Thank you for your interest in contributing to **SPM PNG Studio™**, an open-source project proudly maintained by **SPManchester Private Limited** under the leadership of **Sayed Mudassar Akbar**.

We welcome contributions from developers worldwide to improve performance, enhance privacy features, add new formats, and polish the user experience.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Pull Requests](#pull-requests)
- [Development Workflow](#development-workflow)
- [Git Commit Conventions](#git-commit-conventions)
- [Code Style & Standards](#code-style--standards)
- [Ownership & Licensing](#ownership--licensing)
- [Community & Support](#community--support)

---

## Code of Conduct

All contributors and participants are expected to uphold our [Code of Conduct](./CODE_OF_CONDUCT.md). Please treat all members of the community with dignity, respect, and professionalism.

---

## How to Contribute

### Reporting Bugs

Before submitting a bug report:
1. Check the [Issue Tracker](https://github.com/serviceprovidermanchester/SPM-PNG-Studio-/issues) to ensure the issue has not already been reported.
2. Confirm the bug reproduces on the latest `main` branch.
3. If reporting a new bug, please provide:
   - A clear and descriptive title.
   - Exact steps to reproduce.
   - Browser and OS version (e.g., Chrome 124 on macOS 14.4 / Windows 11).
   - Console logs or error screenshots if available.

### Suggesting Enhancements

Feature requests and performance optimizations are warmly welcomed!
- Open an issue using the **Feature Request** template.
- Describe the motivation, business use case, and proposed implementation details.
- Discuss how it maintains our core philosophy: **100% in-browser, privacy-preserving, zero server uploads**.

### Pull Requests

1. **Fork** the repository and create your feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Commit** your changes following our Conventional Commits guidelines.
3. **Test** thoroughly in multiple browsers (Chrome, Firefox, Safari, Edge).
4. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a **Pull Request** targeting the `main` branch, explaining the changes and linking relevant issues.

---

## Development Workflow

### Prerequisites
- Node.js (v18.x or later)
- Modern web browser with Canvas2D and WebAssembly support

### Setup
```bash
# Clone the repository
git clone https://github.com/serviceprovidermanchester/SPM-PNG-Studio-.git
cd png

# Install developer dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## Git Commit Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` Introduces a new feature or conversion format.
- `fix:` Patches a bug or encoder issue.
- `docs:` Documentation updates, README refinements.
- `style:` Formatting, UI CSS tweaks (no logic change).
- `refactor:` Code reorganization that neither adds a feature nor fixes a bug.
- `perf:` Performance enhancement (e.g., memory optimization, faster canvas rendering).
- `test:` Adding or updating unit tests.
- `chore:` Build scripts, dependency updates, configuration files.

**Example:**
```text
feat(encoder): add support for AVIF in-browser conversion
fix(ico): resolve 32-bit palette alignment offset
docs(readme): add enterprise deployment guidelines
```

---

## Code Style & Standards

- **Zero Server Leaks:** Under no circumstances should user files, thumbnails, or metadata be transmitted to external servers. All operations must remain strictly client-side.
- **Vanilla JavaScript & Performance:** Keep client bundles lightweight. Prefer native Web APIs (`OffscreenCanvas`, `Blob`, `ArrayBuffer`, `DataView`) over heavy external dependencies.
- **Clean Architecture:** Keep core logic separated in `src/core/` and decoupled from DOM UI logic.
- **Accessibility (a11y):** Ensure full keyboard navigability (`Tab`, `Space`, `Enter`), semantic HTML5 tags, and ARIA attributes for dropzones and status announcements.

---

## Ownership & Licensing

By contributing to SPM PNG Studio, you agree that your contributions will be licensed under the project's [MIT License](./LICENSE) and attributed to **SPManchester Private Limited**.

---

## Community & Support

For enterprise inquiries, custom implementations, or partnership discussions:
- **Company:** SPManchester Private Limited
- **Official Website:** [www.spmanchester.com](https://www.spmanchester.com)
- **Author & Founder:** Sayed Mudassar Akbar
- **Support & Security:** [info@spmanchester.com](mailto:info@spmanchester.com)
