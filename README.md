![Barcoda](/public/OpenGraph.webp)

# Barcoda - Barcode Generator

🤳🏻 Modern barcode generator that combines sleek design with seamless functionality. Built on Next.js, Tailwind CSS, and Shadcn UI for effortless customization. Barcoda allows you to create, customize, and download barcodes in various formats, completely free of charge.

---

## ✨ Features

- **Real-time Preview:** Instantly see how your barcode looks as you adjust the settings.
- **Multiple Barcode Formats:** Supports a wide range of barcode types, including CODE128, EAN13, UPC, CODE39, and more.
- **Customizable Parameters:** Control bar width, height, margin, colors, text display, font, and alignment.
- **Download Options:** Download your generated barcodes in PNG, JPEG, WebP, and SVG formats.
- **User-Friendly Interface:** Intuitive controls for easy barcode customization.
- **Dark/Light Mode:** Adapts to your system's theme for comfortable use in any environment.
- **Responsive Design:** Works seamlessly on desktops, tablets, and mobile devices.
- **Free and Open Source:** Use Barcoda without any cost and contribute to its development.

---

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/): React framework for building performant web applications.
- [Tailwind CSS](https://tailwindcss.com/): Utility-first CSS framework for rapid UI development.
- [Shadcn UI](https://ui.shadcn.com/): Re-usable components built using Radix UI and Tailwind CSS.
- [JsBarcode](https://github.com/lindell/JsBarcode): JavaScript barcode generator.

---

## 🚀 Deploy your own

[![Deploy with Vercel](_deploy_vercel.svg)](https://vercel.com/new/clone?repository-url=https://github.com/KurutoDenzeru/barcoda)  [![Deploy with Netlify](_deploy_netlify.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/KurutoDenzeru/barcoda)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/KurutoDenzeru/password-forge.git
cd password-forge
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

The main configurations for the barcode generator are located within the `src/components` directory, specifically in:

- `src/components/BarcodeControls.tsx`:  Handles the UI and logic for barcode customization.
- `src/components/BarcodePreview.tsx`:  Handles the display and download of the generated barcode.
- `src/components/constants/barcodeConstants.ts`: Defines constants such as barcode types, font options, and format examples.

## Contributing

Contributions are always welcome!

See `Contributing.md` for ways to get started.

<!-- Please adhere to this project's `Code of Conduct`. -->

## 📄 License

[MIT](LICENSE)
