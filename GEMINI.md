# Project Overview

This is a personal portfolio and blog website built with [Astro](https://astro.build/), a modern static site generator. It is designed to be performant, content-focused, and easy to maintain.

**Key Technologies:**
*   **Astro:** The core framework for building the static site.
*   **Tailwind CSS:** A utility-first CSS framework for styling.
*   **MDX:** Allows writing content in Markdown with embedded components.
*   **TypeScript:** Used for type safety in configuration and components.

The project is configured to output a static build to the `docs/` directory, making it ready for deployment to GitHub Pages.

# Project Structure

The source code is located in the `src/` directory. Here is how the project is organized:

## `src/` Directory Breakdown

| Directory | Description |
| :--- | :--- |
| **`assets/`** | Contains source images and other assets. Images here are optimized by Astro during the build process (e.g., converted to WebP, resized). |
| **`components/`** | Reusable UI components used across pages and layouts. Examples include `Header.astro`, `Footer.astro`, and `BaseHead.astro` (for `<head>` metadata). |
| **`content/`** | Stores the actual content of the website. The `blog` collection lives here. See `src/content.config.ts` for the schema definition. |
| **`layouts/`** | Wrapper components that provide a consistent structure (HTML shell, header, footer) for pages. `BlogPost.astro` is specific to blog posts. |
| **`pages/`** | Defines the routes of the website. Astro uses file-based routing here. |
| **`styles/`** | Global styles, including Tailwind directives. See `global.css`. |

## Key Files

*   **`astro.config.mjs`**: The main configuration file for Astro. It sets the `outDir` to `./docs` and configures integrations like MDX, Sitemap, and Tailwind.
*   **`src/content.config.ts`**: Defines the content collections and their schemas (using Zod validation). Currently, a `blog` collection is defined.
*   **`src/consts.ts`**: Global constants for the site title and description.
*   **`tailwind.config.cjs`**: Configuration for Tailwind CSS (theme, plugins, content paths).

# Design Choices

### 1. Static Site Generation (SSG)
The site is built as a static site (HTML, CSS, JS) for maximum performance and security. This allows hosting on simple static file servers like GitHub Pages without a backend runtime.

### 2. Content Collections
We use Astro's [Content Collections](https://docs.astro.build/en/guides/content-collections/) to manage blog posts. This provides type safety for frontmatter (metadata like title, date, tags) and ensures consistent data structure across all posts.
*   **Schema:** Defined in `src/content.config.ts`.
*   **Usage:** Content is queried using `getCollection('blog')` in pages like `src/pages/index.astro` and `src/pages/blog/[...slug].astro`.

### 3. Styling with Tailwind
Tailwind CSS is used for styling to keep the CSS bundle small and to allow for rapid UI development directly in the HTML markup.
*   **Global Styles:** `src/styles/global.css` imports Tailwind layers.
*   **Customization:** Theme customizations (colors, fonts) are handled in `tailwind.config.cjs`.

### 4. Image Optimization
Images stored in `src/assets/` are processed by Astro's `<Image />` component. This automatically generates responsive, optimized images (e.g., WebP format) in the build output, improving page load speeds.

# Build & Deployment Pipeline

When you run `npm run build`, Astro transforms the `src/` files into a static website in the `docs/` folder.

**Mapping Source to Output:**

1.  **Pages:**
    *   `src/pages/index.astro` → `docs/index.html` (Homepage)
    *   `src/pages/about.astro` → `docs/about/index.html`
    *   `src/pages/internships.astro` → `docs/internships/index.html`

2.  **Dynamic Routes:**
    *   `src/pages/blog/[...slug].astro` generates a static page for *every* markdown file in `src/content/blog/`.
    *   Example: `src/content/blog/my-post.md` → `docs/blog/my-post/index.html`.

3.  **Assets:**
    *   Files in `public/` (like `favicon.svg`) are copied **as-is** to `docs/`.
    *   Files in `src/assets/` are optimized, renamed (hashed), and placed in `docs/_astro/`.

# Development Commands

| Command | Description |
| :--- | :--- |
| `npm install` | Installs dependencies defined in `package.json`. |
| `npm run dev` | Starts a local development server at `localhost:4321`. |
| `npm run build` | Builds the production site to `docs/`. **Run this before pushing to GitHub.** |
| `npm run preview` | Previews the built site from `docs/` locally to verify the output. |
