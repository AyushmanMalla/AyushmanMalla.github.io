# Using This Repo

Quick reference for running the site locally, writing blog posts, adding Space Type Generator videos, and publishing to GitHub Pages.

---

## 1. Local Preview

```bash
npm run dev
```

Opens at `http://localhost:4321/`. Edits to pages, styles, and blog posts reload automatically.

---

## 2. Writing a New Blog Post

### Scaffold a draft
```bash
npm run new-post -- "Your Post Title"
```

This creates:
- `src/content/blog/your-post-title.md` with pre-filled frontmatter and `draft: true`
- `src/assets/blogs/your-post-title/` for any images used inside the post

Posts with `draft: true` appear when running `npm run dev` so you can preview them live, and are **automatically excluded** from production builds (`docs/`), RSS, and the sitemap until you publish.

### Writing in Obsidian or your IDE
- **Obsidian (recommended for Confluence/Slack-style writing):** Draft your post in your Obsidian Vault with Live Preview, code fences, and tables. When ready, copy or move the `.md` file into `src/content/blog/` and put any images into `src/assets/blogs/<slug>/`.
- **Standard Markdown image path:** Reference images relative to the post file so Astro optimizes them into WebP:
  ```markdown
  ![Diagram description](../../assets/blogs/your-post-title/diagram.png)
  ```
- **VS Code WYSIWYG (optional):** If you want Confluence-style editing directly inside VS Code, the `zaaack.markdown-editor` extension opens `.md` files with a rich toolbar and Slack-like auto-formatting.

### Publishing a draft
1. Remove `draft: true` (or change it to `draft: false`) in the post's frontmatter.
2. Run `npm run verify` (see Section 4).

---

## 3. Adding a Space Type Generator Video Loop

Mobile browsers (especially iOS Safari) need H.264 `.mp4` files with `yuv420p` and `faststart`. Drop your raw screen recording or `.webm`/`.mp4` export through:

```bash
npm run prep-video -- ~/Downloads/my-recording.webm my-loop-name
```

Requires `ffmpeg` (`brew install ffmpeg` on macOS). It outputs:
- `public/media/my-loop-name.mp4` (mobile-safe, muted, faststart H.264)
- `src/assets/my-loop-name-poster.webp` (instant poster + social preview image)

Then paste the printed lines into your post's frontmatter:
```yaml
heroImage: "../../assets/my-loop-name-poster.webp"
heroVideo: "/media/my-loop-name.mp4"
```

---

## 4. Verify & Deploy to GitHub Pages

GitHub Pages serves the committed `docs/` directory directly. Before pushing:

```bash
npm run verify
```

This runs:
1. `npm run check` — TypeScript & Astro content schema validation
2. `npm run build` — Rebuilds the static site into `docs/`
3. `npm run test` — Runs the Playwright suite across mobile, tablet, and desktop viewports

If everything passes, commit your changes (including the updated `docs/`) and push:

```bash
git add -A
git commit -m "post: add <post title>"
git push
```
