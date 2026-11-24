export const SITE_TITLE = 'Ayushman Malla';
export const SITE_TAGLINE = 'Hardware & Systems Engineer';
export const SITE_DESCRIPTION =
	'Portfolio and technical notes of Ayushman Malla — hardware engineer focused on FPGAs, computer architecture, digital verification, and high-performance systems.';

export const SITE_URL = 'https://ayushmanmalla.github.io';

export const SOCIAL_LINKS = {
	github: 'https://github.com/AyushmanMalla',
	linkedin: 'https://www.linkedin.com/in/ayushman-malla-952900229/',
	email: 'mailto:ayushman.malla@e.ntu.edu.sg',
	emailDisplay: 'ayushman.malla@e.ntu.edu.sg',
} as const;

export const NAV_LINKS = [
	{ label: 'Blog', href: '/blog/' },
	{ label: 'Internships', href: '/internships/' },
	{ label: 'About', href: '/about/' },
] as const;

export const FOCUS_AREAS = [
	{
		code: '01',
		title: 'FPGA & Digital Design',
		summary: 'High-throughput datapaths, 10G Ethernet packet forwarding, FEC, and Xilinx Zynq UltraScale+ bring-up.',
	},
	{
		code: '02',
		title: 'Computer Architecture',
		summary: 'CPU memory subsystems, cache locality, branch prediction, and microarchitectural performance bottlenecks.',
	},
	{
		code: '03',
		title: 'Silicon Verification & Debug',
		summary: 'Enterprise EPYC MBIST failure isolation across multi-million-point search spaces and Advantest SMT7 ATE flows.',
	},
	{
		code: '04',
		title: 'Applied AI & Systems',
		summary: 'Bridging low-level hardware intuition with ML inference runtimes, medical imaging, and autonomous perception.',
	},
] as const;
