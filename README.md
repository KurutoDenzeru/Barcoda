![Barcoda](/public/OpenGraph.webp)

# Barcoda - Barcode + QR Generator & Code Scanner

🤳🏻 Modern barcode + QR code generator with built-in code scanner, combining sleek design with seamless functionality. Built on Next.js, Tailwind, and Shadcn for effortless customization.

---

## 🚀 Deploy your own

[![Deploy with Vercel](_deploy_vercel.svg)](https://vercel.com/new/clone?repository-url=https://github.com/KurutoDenzeru/Barcoda)  [![Deploy with Netlify](_deploy_netlify.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/KurutoDenzeru/Barcoda)

---

## ✨ Features — At a glance

- **Real-time Preview** — Instant visual feedback while editing.
- **Multi-format Support** — CODE128, EAN13, UPC, CODE39, and more.
- **Flexible Customization** — Size, margin, colors, text, font, and alignment.
- **Export Options** — PNG, JPEG, WebP, SVG (including raw SVG export).
- **QR Styling** — Dots, corners, rounded shapes, logos, and error correction.
- **Scan & Upload** — Camera scanning and image upload support via `html5-qrcode`.
- **Responsive & Accessible UI** — Built with Tailwind CSS and shadcn/ui; supports dark/light mode.
- **Free & Open Source** — MIT licensed; contributions welcome.

---

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/): React framework for building performant web applications.
- [Tailwind CSS](https://tailwindcss.com/): Utility-first CSS framework for rapid UI development.
- [Shadcn UI](https://ui.shadcn.com/): Re-usable components built using Radix UI and Tailwind CSS.
- [JsBarcode](https://github.com/lindell/JsBarcode): JavaScript barcode generator.
- [html5-qrcode](https://github.com/mebjas/html5-qrcode): Lightweight camera + image scanner for QR codes and barcodes (used for Code Scanner).
- [qr-code-styling](https://github.com/kozakdenys/qr-code-styling): Highly customizable QR generator with styling, logos, and multiple export formats.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/KurutoDenzeru/Barcoda.git
cd Barcoda
```

### 2. Install dependencies

```bash
# With npm
yarn install
# or
npm install
# or
bun install
```

### 3. Run the development server

```bash
npm run dev
# or
yarn dev
# or
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📦 Build for Production

```bash
npm run build
npm start
```

---

## ⚙️ Configuration

The editor is componentized under `src/components`. Key areas to customize are:

```text
app/                        # Next.js App Router pages & layouts
  page.tsx                  # Main page that mounts QRBarcodeGenerator
  layout.tsx                # Global layout, fonts, metadata (Open Graph, structured data)
  qr-barcode-generator/     # QR & Barcode features (generator, scanner, types)
    index.tsx               # Page integration (tabs/navigation)
    barcode-generator.tsx   # JsBarcode-based barcode generator
    qr-generator.tsx        # QR generator using qr-code-styling (styling, logos, export)
    code-scanner.tsx        # Scanner using html5-qrcode (camera & image scan)
    types.ts                # Types, defaults, and settings
  ui/                       # shadcn/ui primitives (buttons, inputs, cards, etc.)
lib/                        # Utilities and helpers
  utils.ts                  # Helper functions
```

## Contributing

Contributions are always welcome!

See `Contributing.md` for ways to get started.

<!-- Please adhere to this project's `Code of Conduct`. -->

## 📄 License

[MIT](LICENSE)
