import { expect, test } from '@playwright/test';

const ROUTES = [
	'/',
	'/blog/',
	'/blog/branch-prediction/',
	'/blog/cache-locality-vs-asymptotic-analysis/',
	'/internships/',
	'/about/',
];

const VIEWPORTS = [
	{ name: 'mobile', width: 375, height: 812 },
	{ name: 'small-tablet', width: 640, height: 900 },
	{ name: 'tablet', width: 768, height: 1024 },
	{ name: 'desktop', width: 1280, height: 800 },
	{ name: 'wide', width: 1536, height: 960 },
];

test.describe('Core HTML, SEO, RSS & Asset Integrity', () => {
	for (const route of ROUTES) {
		test(`document semantics & metadata on ${route}`, async ({ page, request }) => {
			const consoleErrors: string[] = [];
			const pageErrors: string[] = [];
			page.on('console', (msg) => {
				if (msg.type() === 'error') consoleErrors.push(msg.text());
			});
			page.on('pageerror', (err) => pageErrors.push(err.message));

			const res = await page.goto(route, { waitUntil: 'networkidle' });
			expect(res?.status(), `HTTP 200 for ${route}`).toBe(200);

			// Valid HTML5 doctype (no quirks mode)
			const doctype = await page.evaluate(() => document.doctype?.name ?? null);
			expect(doctype, `HTML5 doctype on ${route}`).toBe('html');

			// Title & non-placeholder meta description
			const title = await page.title();
			expect(title.trim().length, `Non-empty title on ${route}`).toBeGreaterThan(3);

			const description = await page
				.locator('meta[name="description"]')
				.getAttribute('content');
			expect(description, `Meta description present on ${route}`).toBeTruthy();
			expect(description?.toLowerCase()).not.toContain('lorem ipsum');

			// Landmarks & heading structure
			await expect(page.locator('header').first()).toBeVisible();
			await expect(page.locator('main')).toHaveCount(1);
			await expect(page.locator('footer').first()).toBeVisible();
			expect(
				await page.locator('h1').count(),
				`Single <h1> on ${route}`,
			).toBe(1);

			// No empty placeholder sections (e.g., heading with no links/content)
			const emptySections = await page.evaluate(() => {
				const issues: string[] = [];
				for (const section of document.querySelectorAll('main section')) {
					const text = section.textContent?.trim() ?? '';
					const hasMediaOrInteractive =
						section.querySelector('a, button, img, video, ul, ol, p, article, dl, table') !== null;
					if (text.length > 0 && !hasMediaOrInteractive) {
						issues.push(text.slice(0, 80));
					}
				}
				return issues;
			});
			expect(emptySections, `No dead/empty sections on ${route}`).toEqual([]);

			// Favicon must exist, return 200, and be lightweight (< 150 KB)
			const iconHref = await page.locator('link[rel="icon"]').first().getAttribute('href');
			expect(iconHref, 'Favicon link present').toBeTruthy();
			if (iconHref) {
				const iconRes = await request.get(iconHref);
				expect(iconRes.status(), `Favicon ${iconHref} returns 200`).toBe(200);
				const body = await iconRes.body();
				expect(
					body.byteLength,
					`Favicon ${iconHref} should be < 150 KB (got ${body.byteLength} bytes)`,
				).toBeLessThan(150 * 1024);
			}

			// No known typos left in rendered page copy
			const bodyText = await page.locator('body').innerText();
			for (const typo of ['Developement', 'forwader', 'obssessed', 'alloewd', 'recieved']) {
				expect(bodyText, `No typo "${typo}" on ${route}`).not.toContain(typo);
			}

			expect(consoleErrors, `No console errors on ${route}`).toEqual([]);
			expect(pageErrors, `No uncaught page errors on ${route}`).toEqual([]);
		});
	}

	test('RSS feed returns valid XML with working post links', async ({ request }) => {
		const res = await request.get('/rss.xml');
		expect(res.status()).toBe(200);
		const xml = await res.text();
		expect(xml).toContain('<rss');
		const links = [...xml.matchAll(/<item>[\s\S]*?<link>(.*?)<\/link>/g)].map((m) => m[1]);
		expect(links.length).toBeGreaterThanOrEqual(2);
		for (const rawLink of links) {
			const url = new URL(rawLink);
			const postRes = await request.get(url.pathname);
			expect(postRes.status(), `RSS link ${url.pathname} resolves with 200`).toBe(200);
		}
	});
});

test.describe('Responsive Layout, Resizing, Container & Aspect Ratio Guards', () => {
	for (const vp of VIEWPORTS) {
		for (const route of ROUTES) {
			test(`${route} @ ${vp.name} (${vp.width}x${vp.height})`, async ({ page, request }) => {
				await page.setViewportSize({ width: vp.width, height: vp.height });
				await page.goto(route, { waitUntil: 'networkidle' });

				// 1. Zero horizontal overflow
				const overflow = await page.evaluate(() => ({
					scrollWidth: document.documentElement.scrollWidth,
					innerWidth: window.innerWidth,
				}));
				expect(
					overflow.scrollWidth,
					`No horizontal overflow on ${route} @ ${vp.name}`,
				).toBeLessThanOrEqual(overflow.innerWidth + 1);

				// 2. Images: scroll lazy images into view, verify loaded, contained, zero aspect-ratio distortion
				await page.evaluate(async () => {
					const imgs = Array.from(document.querySelectorAll('img'));
					for (const img of imgs) {
						img.scrollIntoView({ behavior: 'instant', block: 'center' });
						if (!img.complete) {
							await new Promise<void>((resolve) => {
								img.addEventListener('load', () => resolve(), { once: true });
								img.addEventListener('error', () => resolve(), { once: true });
								setTimeout(resolve, 3000);
							});
						}
					}
					window.scrollTo(0, 0);
				});

				const imageAudit = await page.evaluate(() => {
					const issues: string[] = [];
					for (const img of document.querySelectorAll('img')) {
						const style = getComputedStyle(img);
						if (style.display === 'none' || style.visibility === 'hidden') continue;
						const rect = img.getBoundingClientRect();
						if (rect.width === 0 || rect.height === 0) {
							issues.push(`Zero-size image: ${img.src}`);
							continue;
						}
						if (!img.complete || img.naturalWidth === 0) {
							issues.push(`Broken image: ${img.src}`);
							continue;
						}
						if (rect.right > window.innerWidth + 2 || rect.left < -2) {
							issues.push(
								`Image overflows viewport (${rect.left.toFixed(1)}..${rect.right.toFixed(1)} > ${window.innerWidth}): ${img.src}`,
							);
						}
						const naturalRatio = img.naturalWidth / img.naturalHeight;
						const renderedRatio = rect.width / rect.height;
						if (style.objectFit === 'fill' || style.objectFit === '') {
							const distortion = renderedRatio / naturalRatio;
							if (distortion < 0.88 || distortion > 1.12) {
								issues.push(
									`Aspect-ratio distortion (${distortion.toFixed(2)}x, natural=${naturalRatio.toFixed(2)}, rendered=${renderedRatio.toFixed(2)}): ${img.src}`,
								);
							}
						} else if (renderedRatio < 0.35 || renderedRatio > 4.2) {
							issues.push(
								`Extreme cropped box ratio (${renderedRatio.toFixed(2)}): ${img.src}`,
							);
						}
					}
					return issues;
				});
				expect(imageAudit, `Image integrity on ${route} @ ${vp.name}`).toEqual([]);

				// 3. Videos: valid source, fits viewport, muted + playsinline
				const videoAudit = await page.evaluate(() => {
					const videos: {
						src: string;
						overflows: boolean;
						muted: boolean;
						playsInline: boolean;
						width: number;
						height: number;
					}[] = [];
					for (const video of document.querySelectorAll('video')) {
						const rect = video.getBoundingClientRect();
						const src =
							video.currentSrc ||
							video.getAttribute('src') ||
							video.querySelector('source')?.getAttribute('src') ||
							'';
						videos.push({
							src,
							overflows: rect.right > window.innerWidth + 2 || rect.left < -2,
							muted: video.muted,
							playsInline: video.playsInline,
							width: rect.width,
							height: rect.height,
						});
					}
					return videos;
				});

				for (const v of videoAudit) {
					expect(v.src, `Video has src on ${route}`).toBeTruthy();
					expect(v.overflows, `Video fits viewport on ${route} @ ${vp.name}`).toBe(false);
					expect(v.width, `Video has rendered width on ${route}`).toBeGreaterThan(100);
					expect(v.height, `Video has rendered height on ${route}`).toBeGreaterThan(40);
					expect(v.muted, `Autoplaying video is muted on ${route}`).toBe(true);
					expect(v.playsInline, `Video has playsInline on ${route}`).toBe(true);
					const videoRes = await request.head(v.src);
					expect(videoRes.status(), `Video source ${v.src} returns 200`).toBe(200);
				}

				// 4. Header navigation fits cleanly without overflowing header or viewport
				const headerIssues = await page.evaluate(() => {
					const header = document.querySelector('header');
					if (!header) return ['Missing header'];
					const hRect = header.getBoundingClientRect();
					const issues: string[] = [];
					if (hRect.right > window.innerWidth + 2) {
						issues.push(`Header wider than viewport: ${hRect.right}`);
					}
					for (const link of header.querySelectorAll('a')) {
						const style = getComputedStyle(link);
						if (style.display === 'none' || style.visibility === 'hidden') continue;
						const rect = link.getBoundingClientRect();
						if (rect.width === 0 || rect.height === 0) continue;
						if (rect.right > window.innerWidth + 2) {
							issues.push(`Nav link "${link.textContent?.trim()}" overflows right edge`);
						}
						// Ensure nav links don't wrap into 3+ lines
						if (rect.height > 56) {
							issues.push(
								`Nav link "${link.textContent?.trim()}" wrapped awkwardly (height=${rect.height})`,
							);
						}
					}
					return issues;
				});
				expect(headerIssues, `Header fit on ${route} @ ${vp.name}`).toEqual([]);

				// 5. Code blocks & tables stay contained inside viewport
				const contentOverflow = await page.evaluate(() => {
					const issues: string[] = [];
					for (const el of document.querySelectorAll('main pre, main table')) {
						const rect = el.getBoundingClientRect();
						if (rect.right > window.innerWidth + 2) {
							issues.push(
								`${el.tagName} overflows viewport (${rect.right.toFixed(1)} > ${window.innerWidth})`,
							);
						}
					}
					return issues;
				});
				expect(contentOverflow, `Code/table containment on ${route} @ ${vp.name}`).toEqual([]);
			});
		}
	}

	test('dynamic viewport resize does not introduce overflow or collapse layout', async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 900 });
		await page.goto('/', { waitUntil: 'networkidle' });

		for (const width of [1280, 1024, 768, 640, 375, 320, 1280]) {
			await page.setViewportSize({ width, height: 812 });
			await page.waitForTimeout(100);
			const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
			expect(scrollWidth, `No overflow after resize to ${width}px`).toBeLessThanOrEqual(
				width + 1,
			);
		}
	});

	test('interactive media pause/play control works when kinetic video is present', async ({
		page,
	}) => {
		await page.setViewportSize({ width: 1280, height: 800 });
		await page.goto('/about/', { waitUntil: 'networkidle' });
		const toggleBtn = page.locator('[data-media-toggle]').first();
		await expect(toggleBtn).toBeVisible();
		const initialLabel = await toggleBtn.getAttribute('aria-label');
		await toggleBtn.click();
		const nextLabel = await toggleBtn.getAttribute('aria-label');
		expect(nextLabel).not.toBe(initialLabel);
	});

	test('copy-email button on homepage updates feedback state on click', async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 800 });
		await page.goto('/', { waitUntil: 'networkidle' });
		const copyBtn = page.locator('[data-copy-email]').first();
		await expect(copyBtn).toBeVisible();
		const status = copyBtn.locator('[data-copy-status]');
		await expect(status).toHaveText('Copy');
		await copyBtn.click();
		await expect(status).toHaveText('Copied ✓');
		await expect(copyBtn).toHaveAttribute('data-copied', 'true');
	});

	test('code-block copy button on blog post works without overflowing mobile 375px', async ({
		page,
	}) => {
		await page.setViewportSize({ width: 375, height: 812 });
		await page.goto('/blog/branch-prediction/', { waitUntil: 'networkidle' });

		const copyBtn = page.locator('[data-code-copy]').first();
		await expect(copyBtn).toBeVisible();
		await expect(copyBtn).toHaveText('Copy');

		const bounds = await page.evaluate(() => {
			const btn = document.querySelector('[data-code-copy]');
			const rect = btn?.getBoundingClientRect();
			return {
				btnRight: rect?.right ?? 0,
				btnLeft: rect?.left ?? 0,
				scrollWidth: document.documentElement.scrollWidth,
				innerWidth: window.innerWidth,
			};
		});
		expect(bounds.btnLeft).toBeGreaterThanOrEqual(0);
		expect(bounds.btnRight).toBeLessThanOrEqual(bounds.innerWidth + 1);
		expect(bounds.scrollWidth).toBeLessThanOrEqual(bounds.innerWidth + 1);

		await copyBtn.click();
		await expect(copyBtn).toHaveText('Copied ✓');
		await expect(copyBtn).toHaveAttribute('data-copied', 'true');
	});
});

test.describe('SEO, Google Search Console & Indexing Integrity', () => {
	test('homepage preserves Google Search Console verification tag and Person JSON-LD', async ({
		page,
	}) => {
		await page.goto('/', { waitUntil: 'networkidle' });

		const gsc = await page
			.locator('meta[name="google-site-verification"]')
			.getAttribute('content');
		expect(gsc).toBe('kdgSpY7QTIkW8ZWul4Ma-UEsBqYUBlJ-qvlFd5e80x4');

		const robotsMeta = await page.locator('meta[name="robots"]').getAttribute('content');
		expect(robotsMeta).toBe('index, follow');

		const jsonLdRaw = await page.locator('script[type="application/ld+json"]').first().textContent();
		expect(jsonLdRaw).toBeTruthy();
		const parsed = JSON.parse(jsonLdRaw!);
		expect(parsed['@type']).toBe('Person');
		expect(parsed.url).toBe('https://ayushmanmalla.github.io');
	});

	test('all routes expose valid canonical URLs, Open Graph tags, and BlogPosting JSON-LD on posts', async ({
		page,
	}) => {
		for (const route of ROUTES) {
			await page.goto(route, { waitUntil: 'networkidle' });
			const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
			expect(canonical, `Canonical on ${route}`).toBe(`https://ayushmanmalla.github.io${route}`);

			const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
			const isPost = route.startsWith('/blog/') && route !== '/blog/';
			expect(ogType, `og:type on ${route}`).toBe(isPost ? 'article' : 'website');

			const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
			expect(ogImage, `Absolute og:image on ${route}`).toMatch(/^https:\/\/ayushmanmalla\.github\.io\//);

			if (isPost) {
				const jsonLdRaw = await page
					.locator('script[type="application/ld+json"]')
					.first()
					.textContent();
				const parsed = JSON.parse(jsonLdRaw!);
				expect(parsed['@type']).toBe('BlogPosting');
				expect(parsed.headline).toBeTruthy();
				expect(parsed.datePublished).toBeTruthy();
			}
		}
	});

	test('robots.txt, sitemap-index.xml, and sitemap-0.xml preserve every indexed URL', async ({
		request,
	}) => {
		const robotsRes = await request.get('/robots.txt');
		expect(robotsRes.status()).toBe(200);
		const robotsTxt = await robotsRes.text();
		expect(robotsTxt).toContain('Allow: /');
		expect(robotsTxt).toContain('Sitemap: https://ayushmanmalla.github.io/sitemap-index.xml');

		const indexRes = await request.get('/sitemap-index.xml');
		expect(indexRes.status()).toBe(200);
		expect(await indexRes.text()).toContain('https://ayushmanmalla.github.io/sitemap-0.xml');

		const mapRes = await request.get('/sitemap-0.xml');
		expect(mapRes.status()).toBe(200);
		const mapXml = await mapRes.text();
		for (const route of ROUTES) {
			expect(mapXml, `Sitemap includes ${route}`).toContain(
				`<loc>https://ayushmanmalla.github.io${route}</loc>`,
			);
		}
	});
});

test.describe('Security & Hardening Guards', () => {
	test('security helpers neutralize script breakout and unsafe video URLs', async () => {
		const { serializeJsonLd, isSafeLocalVideoPath } = await import('../src/utils/security.ts');

		const escaped = serializeJsonLd({
			title: '</script><script>alert("xss")</script>&test',
		});
		expect(escaped).not.toContain('</script>');
		expect(escaped).not.toContain('<');
		expect(escaped).not.toContain('>');
		expect(JSON.parse(escaped)).toEqual({
			title: '</script><script>alert("xss")</script>&test',
		});

		expect(isSafeLocalVideoPath('/media/wave.webm')).toBe(true);
		expect(isSafeLocalVideoPath('/media/about.mp4')).toBe(true);
		expect(isSafeLocalVideoPath('javascript:alert(1)')).toBe(false);
		expect(isSafeLocalVideoPath('//evil.example/a.mp4')).toBe(false);
		expect(isSafeLocalVideoPath('https://evil.example/a.mp4')).toBe(false);
		expect(isSafeLocalVideoPath('/media/../etc/passwd.mp4')).toBe(false);
		expect(isSafeLocalVideoPath('/media/file.svg')).toBe(false);
	});

	test('all routes set Referrer-Policy and protect target="_blank" links with noopener noreferrer', async ({
		page,
	}) => {
		for (const route of ROUTES) {
			await page.goto(route, { waitUntil: 'networkidle' });

			const referrer = await page.locator('meta[name="referrer"]').getAttribute('content');
			expect(referrer, `Referrer policy on ${route}`).toBe('strict-origin-when-cross-origin');

			const unsafeBlankLinks = await page.evaluate(() => {
				const issues: string[] = [];
				for (const link of document.querySelectorAll('a[target="_blank"]')) {
					const relTokens = (link.getAttribute('rel') ?? '').toLowerCase().split(/\s+/);
					if (!relTokens.includes('noopener') || !relTokens.includes('noreferrer')) {
						issues.push(link.getAttribute('href') ?? link.textContent?.trim() ?? 'unknown');
					}
				}
				return issues;
			});
			expect(unsafeBlankLinks, `Safe target="_blank" rel attributes on ${route}`).toEqual([]);
		}
	});
});
