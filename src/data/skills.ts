// Skill data configuration file
// Used to manage data for the skill display page

export interface Skill {
	id: string;
	name: string;
	description: string;
	icon: string; // Iconify icon name
	category: "frontend" | "backend" | "database" | "tools" | "lang" | "other";
	level: "beginner" | "intermediate" | "advanced" | "expert";
	experience: {
		years: number;
		months: number;
	};
	projects?: string[]; // Related project IDs
	certifications?: string[];
	color?: string; // Skill card theme color
}

export const skillsData: Skill[] = [
	// 前端
	{
		id: "javascript",
		name: "JavaScript",
		description: "刚入门，正在学基础语法。",
		icon: "logos:javascript",
		category: "frontend",
		level: "beginner",
		experience: { years: 0, months: 1 },
		color: "#F7DF1E",
	},
	{
		id: "typescript",
		name: "TypeScript",
		description: "跟着项目在用，还不太熟。",
		icon: "logos:typescript-icon",
		category: "frontend",
		level: "beginner",
		experience: { years: 0, months: 1 },
		color: "#3178C6",
	},
	{
		id: "astro",
		name: "Astro",
		description: "当前博客用的框架，照着文档抄。",
		icon: "logos:astro-icon",
		category: "frontend",
		level: "beginner",
		experience: { years: 0, months: 2 },
		projects: ["mouy-home"],
		color: "#FF5D01",
	},
	{
		id: "svelte",
		name: "Svelte",
		description: "配合 Astro 用的，还搞不太明白。",
		icon: "logos:svelte-icon",
		category: "frontend",
		level: "beginner",
		experience: { years: 0, months: 2 },
		color: "#FF3E00",
	},
	{
		id: "tailwindcss",
		name: "Tailwind CSS",
		description: "比手写 CSS 方便，边用边查。",
		icon: "logos:tailwindcss-icon",
		category: "frontend",
		level: "beginner",
		experience: { years: 0, months: 1 },
		color: "#06B6D4",
	},

	// 后端 / 系统语言
	{
		id: "rust",
		name: "Rust",
		description: "刚开始学，觉得所有权好难。",
		icon: "logos:rust",
		category: "lang",
		level: "beginner",
		experience: { years: 0, months: 1 },
		color: "#CE422B",
	},

	// 工具
	{
		id: "git",
		name: "Git",
		description: "会 add commit push，其他现查。",
		icon: "logos:git-icon",
		category: "tools",
		level: "beginner",
		experience: { years: 0, months: 2 },
		color: "#F05032",
	},
	{
		id: "vscode",
		name: "VS Code",
		description: "主力编辑器。",
		icon: "logos:visual-studio-code",
		category: "tools",
		level: "beginner",
		experience: { years: 0, months: 2 },
		color: "#007ACC",
	},
];
