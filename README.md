# Personal Portfolio/Blog Page Repo

## Project Structure

Repo follows the following struct - had to make changes to the default Astro template for github pages deployment project, you'll see the following folders and files:

```text
├── .nojekyll
├── .gitignore
├── docs/
├── public/
├── src/
    ├── assetes/
│   ├── components/
│   ├── content/blog/
│   ├── layouts/
│   └── pages/
    ├── styles/
    consts.ts
    content.config.ts
├── astro.config.mjs
├── README.md
├── package.json
├── tailwind.config.cjs
└── tsconfig.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

The `src/content/` directory contains "collections" of related Markdown and MDX documents. Use `getCollection()` to retrieve posts from `src/content/blog/`, and type-check your frontmatter using an optional schema. See [Astro's Content Collections docs](https://docs.astro.build/en/guides/content-collections/) to learn more.

Any static assets, like images, can be placed in the `public/` directory.

## Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Theme Palette

The project uses a custom color palette defined in `tailwind.config.cjs`:

| Color Name | Hex Code | Usage |
| :--- | :--- | :--- |
| **Background** | `#000000` | Main page background |
| **Primary** | `#FE2600` | Primary accent color (Red) |
| **Accent** | `#FF5B3E` | Secondary accent/Hover states |
| **Secondary** | `#FF917D` | Muted text or subtle highlights |
| **Dark Card** | `#1E1E1E` | Card backgrounds (e.g., blog posts) |