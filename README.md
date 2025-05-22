![Barcoda](/public/sitemap.webp)

# Barcoda - Barcode Generator

Modern barcode generator that combines sleek design with seamless functionality. Built on Next.js, Tailwind CSS, and Shadcn UI for effortless customization. Barcoda allows you to create, customize, and download barcodes in various formats, completely free of charge.

## ✨ Features

- **Real-time Preview:** Instantly see how your barcode looks as you adjust the settings.
- **Multiple Barcode Formats:** Supports a wide range of barcode types, including CODE128, EAN13, UPC, CODE39, and more.
- **Customizable Parameters:** Control bar width, height, margin, colors, text display, font, and alignment.
- **Download Options:** Download your generated barcodes in PNG, JPEG, WebP, and SVG formats.
- **User-Friendly Interface:** Intuitive controls for easy barcode customization.
- **Dark/Light Mode:** Adapts to your system's theme for comfortable use in any environment.
- **Responsive Design:** Works seamlessly on desktops, tablets, and mobile devices.
- **Free and Open Source:** Use Barcoda without any cost and contribute to its development.

## 🚀 Deploy your own

[![Deploy with Vercel](_deploy_vercel.svg)](https://vercel.com/new/clone?repository-url=https://github.com/KurutoDenzeru/barcoda)  [![Deploy with Netlify](_deploy_netlify.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/KurutoDenzeru/barcoda)

## 🛠️ Technologies Used

- [Next.js](https://nextjs.org/): React framework for building performant web applications.
- [Tailwind CSS](https://tailwindcss.com/): Utility-first CSS framework for rapid UI development.
- [Shadcn UI](https://ui.shadcn.com/): Re-usable components built using Radix UI and Tailwind CSS.
- [JsBarcode](https://github.com/lindell/JsBarcode): JavaScript barcode generator.

## 📦 Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/KurutoDenzeru/Barcoda.git
    ```

2. Navigate to the project directory:

    ```bash
    cd barcoda
    ```

3. Install dependencies using bun:

    ```bash
    bun install
    ```

## 💻 Commands

All commands are run from the root of the project, from a terminal:

Replace `bun` with your package manager of choice (`npm`, `pnpm`, `yarn`, etc.).

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `bun install`             | Installs dependencies                            |
| `bun run dev`             | Starts local dev server at `localhost:4321`      |
| `bun run dev:network`     | Starts dev server on local network               |
| `bun run build`           | Build your production site to `./dist/`          |
| `bun run start`           | Starts the production server                       |
| `bun run lint`            | Runs ESLint for code linting                     |
| `bun run format`          | Runs Prettier for code formatting                 |

## 📝 Environment Variables

There are no required environment variables for this project to run.

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

## 👨‍💻 Author

- Kurt Calacday - [https://github.com/KurutoDenzeru](https://github.com/KurutoDenzeru)
