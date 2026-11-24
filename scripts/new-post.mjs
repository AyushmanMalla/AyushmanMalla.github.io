#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rawTitle = process.argv.slice(2).join(' ').trim();

if (!rawTitle) {
	console.error('Usage: npm run new-post -- "Your Post Title"');
	process.exit(1);
}

const slug = rawTitle
	.toLowerCase()
	.replace(/[^a-z0-9]+/g, '-')
	.replace(/^-+|-+$/g, '');

if (!slug) {
	console.error('Could not derive a valid slug from title:', rawTitle);
	process.exit(1);
}

const postPath = path.join(rootDir, 'src', 'content', 'blog', `${slug}.md`);
const assetDir = path.join(rootDir, 'src', 'assets', 'blogs', slug);

if (fs.existsSync(postPath)) {
	console.error(`Post already exists: ${path.relative(rootDir, postPath)}`);
	process.exit(1);
}

const now = new Date();
const yyyy = now.getFullYear();
const mm = String(now.getMonth() + 1).padStart(2, '0');
const dd = String(now.getDate()).padStart(2, '0');
const today = `${yyyy}-${mm}-${dd}`;
const safeTitle = rawTitle.replace(/"/g, '\\"');

const template = `---
title: "${safeTitle}"
description: "One-sentence summary shown on cards and link previews."
pubDate: ${today}
draft: true
tags: []
# heroImage: "../../assets/${slug}-poster.webp"
# heroVideo: "/media/${slug}.mp4"
# heroAlt: "Kinetic typography visual for ${safeTitle}"
---

## Introduction

Start writing here. Put post images in \`src/assets/blogs/${slug}/\` and embed them as:

\`\`\`markdown
![Diagram description](../../assets/blogs/${slug}/diagram.png)
\`\`\`

When you're ready to publish, remove \`draft: true\` (or set \`draft: false\`) and run \`npm run verify\`.
`;

fs.mkdirSync(path.dirname(postPath), { recursive: true });
fs.mkdirSync(assetDir, { recursive: true });
fs.writeFileSync(postPath, template, 'utf8');

console.log(`Created ${path.relative(rootDir, postPath)}`);
console.log(`Created ${path.relative(rootDir, assetDir)}/`);
console.log('Preview live with: npm run dev');
