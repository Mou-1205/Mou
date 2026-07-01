import type { ProfileConfig } from "../types/config";

// 个人资料配置
export const profileConfig: ProfileConfig = {
	avatar: "assets/images/avatar.jpg", // 相对于 /src 目录。如果以 '/' 开头，则相对于 /public 目录
	name: "某炜",
	bio: "以好奇心构建，以清晰度交付",
	typewriter: {
		enable: true, // 启用个人简介打字机效果
		speed: 80, // 打字速度（毫秒）
	},
	links: [
		{
			name: "GitHub",
			icon: "fa7-brands:github",
			url: "https://github.com/Mou-1205",
		},
		{
			name: "抖音",
			icon: "simple-icons:tiktok",
			url: "https://v.douyin.com/dZ95kkGCwJI",
		},
		{
			name: "酷安",
			icon: "mdi:cellphone-android",
			url: "https://www.coolapk.com/u/27377638",
		},
	],
};
