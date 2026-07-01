import { LinkPreset } from "../types/config";

/**
 * 侧栏导航配置
 * 独立于顶部导航栏，用于右侧栏的导航组件
 */
export const sidebarNavConfig = {
	links: [
		// 预设链接：首页
		LinkPreset.Home,
		// 预设链接：归档
		LinkPreset.Archive,

		// 自定义一级下拉菜单：个人内容页面
		{
			name: "My",
			url: "/content/",
			icon: "material-symbols:person",
			children: [
				{
					name: "追剧",
					url: "/anime/",
					icon: "material-symbols:movie",
				},
				{
					name: "Gallery",
					url: "/albums/",
					icon: "material-symbols:photo-library",
				},
				{
					name: "Devices",
					url: "/devices/",
					icon: "material-symbols:devices",
					external: false,
				},
			],
		},

		// 自定义一级下拉菜单：关于相关
		{
			name: "About",
			url: "/content/",
			icon: "material-symbols:info",
			children: [
				{
					name: "About",
					url: "/about/",
					icon: "material-symbols:person",
				},
				{
					name: "Friends",
					url: "/friends/",
					icon: "material-symbols:group",
				},
			],
		},

		// 自定义一级下拉菜单：其他页面
		{
			name: "Others",
			url: "#",
			icon: "material-symbols:more-horiz",
			children: [
				{
					name: "Projects",
					url: "/projects/",
					icon: "material-symbols:work",
				},
				{
					name: "Skills",
					url: "/skills/",
					icon: "material-symbols:psychology",
				},
				{
					name: "Timeline",
					url: "/timeline/",
					icon: "material-symbols:timeline",
				},
			],
		},
	],
};
