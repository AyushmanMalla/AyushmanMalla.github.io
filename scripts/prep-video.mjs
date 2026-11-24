#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [inputArg, nameArg] = process.argv.slice(2);

if (!inputArg) {
	console.error('Usage: npm run prep-video -- <input-video-path> [output-name]');
	process.exit(1);
}

const inputPath = path.resolve(process.cwd(), inputArg);
if (!fs.existsSync(inputPath)) {
	console.error(`Input file not found: ${inputPath}`);
	process.exit(1);
}

const rawName = nameArg || path.basename(inputPath, path.extname(inputPath));
const slug = rawName
	.toLowerCase()
	.replace(/[^a-z0-9-_]+/g, '-')
	.replace(/^-+|-+$/g, '');

if (!slug) {
	console.error('Could not derive a valid output name from:', rawName);
	process.exit(1);
}

const ffmpegCheck = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' });
if (ffmpegCheck.status !== 0) {
	console.error('ffmpeg is required on PATH. On macOS install with: brew install ffmpeg');
	process.exit(1);
}

const mediaDir = path.join(rootDir, 'public', 'media');
const assetsDir = path.join(rootDir, 'src', 'assets');
fs.mkdirSync(mediaDir, { recursive: true });
fs.mkdirSync(assetsDir, { recursive: true });

const mp4Out = path.join(mediaDir, `${slug}.mp4`);
const posterOut = path.join(assetsDir, `${slug}-poster.webp`);

console.log(`Encoding mobile-safe MP4 -> ${path.relative(rootDir, mp4Out)}`);
const mp4Result = spawnSync(
	'ffmpeg',
	[
		'-y',
		'-i',
		inputPath,
		'-an',
		'-c:v',
		'libx264',
		'-profile:v',
		'main',
		'-level',
		'4.0',
		'-pix_fmt',
		'yuv420p',
		'-crf',
		'24',
		'-preset',
		'slow',
		'-movflags',
		'+faststart',
		'-vf',
		'scale=trunc(iw/2)*2:trunc(ih/2)*2',
		mp4Out,
	],
	{ stdio: 'inherit' },
);

if (mp4Result.status !== 0) {
	process.exit(mp4Result.status ?? 1);
}

console.log(`Extracting poster WebP -> ${path.relative(rootDir, posterOut)}`);
const frameResult = spawnSync(
	'ffmpeg',
	['-v', 'error', '-i', mp4Out, '-vframes', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'],
	{ maxBuffer: 25 * 1024 * 1024 },
);

if (frameResult.status !== 0 || !frameResult.stdout?.length) {
	console.error('Failed to extract poster frame with ffmpeg:', frameResult.stderr?.toString() || '');
	process.exit(frameResult.status ?? 1);
}

await sharp(frameResult.stdout).webp({ quality: 85 }).toFile(posterOut);

console.log('\nAdd these lines to your blog post frontmatter:');
console.log(`heroImage: "../../assets/${slug}-poster.webp"`);
console.log(`heroVideo: "/media/${slug}.mp4"`);
