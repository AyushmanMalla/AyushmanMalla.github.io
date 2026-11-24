# Ayushman Malla — Portfolio & Blog

Personal portfolio and technical blog built with [Astro](https://astro.build/) and Tailwind CSS v4, deployed as a static site from `docs/` at [ayushmanmalla.github.io](https://ayushmanmalla.github.io).

See [INSTRUCTION.md](./INSTRUCTION.md) for how to write posts, prep videos, verify builds, and publish updates.

## Structure

```text
├── public/          # Static files copied as-is (fonts, favicon, /media/*.mp4, robots.txt)
├── src/
│   ├── assets/      # Images & video posters optimized by Astro during build
│   ├── components/  # Reusable UI components
│   ├── content/blog/# Markdown / MDX blog posts
│   ├── data/        # Experience / internship data
│   ├── layouts/     # Base and blog post layouts
│   ├── pages/       # File-based routes
│   └── styles/      # Global styles & theme tokens
├── scripts/         # Blog post & video helper scripts
├── tests/           # Playwright layout, SEO, media, and security tests
└── docs/            # Built static output served by GitHub Pages
```
