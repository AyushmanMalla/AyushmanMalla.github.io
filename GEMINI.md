# Project Overview

This is a personal portfolio and blog website built with [Astro](https://astro.build/), a modern static site generator. It uses [Tailwind CSS](https://tailwindcss.com/) for styling and [MDX](https://mdxjs.com/) for authoring content. The project is configured to build a static website and output the files to the `docs` directory, which is the standard for deploying to GitHub Pages for a user or organization page.

The website content is organized into collections within the `src/content/` directory. The main content collection is for the blog, located at `src/content/blog/`. The pages of the website are located in `src/pages/`, and the reusable UI components are in `src/components/`.

# Building and Running

The following commands are used to build and run the project:

| Command | Description |
|---|---|
| `npm install` | Installs the project dependencies. |
| `npm run dev` | Starts a local development server at `localhost:4321`. |
| `npm run build` | Builds the production-ready website to the `docs/` directory. |
| `npm run preview` | Starts a local server to preview the built website. |

# Development Conventions

*   **Content:** Blog posts and other content are written in Markdown or MDX and stored in the `src/content/` directory.
*   **Styling:** Tailwind CSS is used for styling. Utility classes should be used whenever possible. Custom styles can be added to the `src/styles/global.css` file.
*   **Components:** Reusable UI components are created as Astro components and stored in the `src/components/` directory.
*   **Static Assets:** Static assets like images and fonts are stored in the `public/` directory.
