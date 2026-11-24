# Writing a New Blog Post

1. Start live preview:
   ```bash
   npm run dev
   ```
   Open `http://localhost:4321/blog/` — every edit to a Markdown file reloads automatically as you save.

2. Create a new `.md` (or `.mdx`) file in `src/content/blog/`:
   ```markdown
   ---
   title: "Your Post Title"
   description: "One-sentence summary shown on cards and link previews."
   pubDate: 2026-11-24
   tags: ["FPGA", "Verification"]
   heroImage: "../../assets/wave-poster.webp"   # optional static image / poster
   heroVideo: "/media/wave.webm"                # optional Space Type Generator .mp4/.webm loop
   ---

   Write standard Markdown here — fenced code blocks, tables, and local images all work out of the box.
   ```

3. Verify layout & build before pushing:
   ```bash
   npm run verify
   ```
