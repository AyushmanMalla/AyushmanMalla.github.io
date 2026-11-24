import type { ImageMetadata } from 'astro';
import AMDImage from '../assets/AMD.png';
import TranscelestialImage from '../assets/Transcelestial.png';
import UnileverImage from '../assets/Unilever.jpg';

export interface Internship {
	id: string;
	company: string;
	role: string;
	period: string;
	sortDate: string;
	location: string;
	domain: string;
	graphic: ImageMetadata;
	graphicAlt: string;
	aspectHint: 'video' | 'wide';
	highlights: string[];
	paragraphs: string[];
}

export const INTERNSHIPS: Internship[] = [
	{
		id: 'transcelestial',
		company: 'Transcelestial',
		role: 'FPGA / Hardware Engineering Intern',
		period: 'Jul 2025',
		sortDate: '2025-07-01',
		location: 'Singapore',
		domain: 'Optical Wireless / 10G Ethernet',
		graphic: TranscelestialImage,
		graphicAlt: 'Transcelestial optical wireless hardware',
		aspectHint: 'video',
		highlights: ['Zynq UltraScale+ MPSoC', '10G Ethernet L2/L3', 'Forward Error Correction', 'Custom Bootloaders'],
		paragraphs: [
			'Improved and deployed a high-performance packet forwarder capable of handling 10G Ethernet traffic on Xilinx Zynq UltraScale+ MPSoC platforms. Primarily worked on Layer 2/3 networking validation (latency, throughput, and configuration) alongside custom bootloaders for space and terrestrial deployments.',
			'Set up in-house FPGA development infrastructure from scratch and contributed to Forward Error Correction (FEC) for the 10G Ethernet pipeline, working closely across hardware and embedded software teams to improve throughput and reliability.',
			'Side quest unlocked: became unexpectedly proficient with all four espresso machines in the office.',
		],
	},
	{
		id: 'amd',
		company: 'AMD',
		role: 'Hardware Engineering Intern',
		period: 'Jan 2025',
		sortDate: '2025-01-01',
		location: 'Singapore',
		domain: 'Enterprise CPU / Memory Subsystems',
		graphic: AMDImage,
		graphicAlt: 'AMD Enterprise EPYC hardware engineering',
		aspectHint: 'video',
		highlights: ['AMD EPYC Memory Subsystems', 'MBIST IP Debug', '28M-Point Search Space', 'Advantest SMT7 ATE'],
		paragraphs: [
			'Worked in the Enterprise CPU division focusing on the memory subsystems of AMD EPYC processors. The core of my work involved debugging Intellectual Property (IP) failures in the Memory Built-In Self-Test (MBIST) suite.',
			'Built and integrated an automated debug tool for high-priority hyperscaler return units, traversing a search space of roughly 28 million points to isolate failure conditions inside CPU caches. Earned Advantest certification on ATE software (SMT7) and completed hands-on training in System-Level Testing.',
			'Highlight outside the lab: AMD team bonding dinners set an unreasonably high bar for fine dining.',
		],
	},
	{
		id: 'unilever',
		company: 'Unilever',
		role: 'Technology & Finance Intern',
		period: 'May 2024',
		sortDate: '2024-05-01',
		location: 'Singapore',
		domain: 'Data Engineering / Supply Chain Risk',
		graphic: UnileverImage,
		graphicAlt: 'Unilever technology and supply chain analytics',
		aspectHint: 'wide',
		highlights: ['Data Ingestion Pipeline', 'Inventory Risk Reconciliation', '~$1M Annual Savings / Group'],
		paragraphs: [
			'Worked at the intersection of technology, finance, and supply chain to digitize how business waste and inventory exposure are tracked. Designed a validation framework aligned with rigorous accounting standards to bridge physical inventory risk (supply chain) and probable inventory risk (accounting).',
			'Built an end-to-end data ingestion and reconciliation tool across cross-functional teams that surfaces immediate actions for supply chain planners — projected to unlock roughly $1M USD in annual savings per business group.',
		],
	},
];
