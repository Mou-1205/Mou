// 本地番剧数据配置
export interface AnimeItem {
	title: string;
	status: "watching" | "completed" | "planned";
	rating: number;
	cover: string;
	description: string;
	episodes: string;
	year: string;
	genre: string[];
	cast?: string;
	link: string;
	progress: number;
	totalEpisodes: number;
	startDate: string;
	endDate: string;
}

const localAnimeList: AnimeItem[] = [
	{
		title: "铁拳教育",
		status: "completed",
		rating: 9.0,
		cover: "/assets/anime/tiequan.webp",
		description: "在一个校园秩序崩坏、老师不敢管学生、霸凌横行的架空世界里，韩国政府成立了一个特殊机构——「教权保护局」（ERPA）。这个机构的督察们拥有「合法使用武力」的特权，专门用强硬手段整治问题学生、失职老师和蛮横家长，试图用铁拳重建校园的秩序与公平。",
		episodes: "10 episodes",
		year: "2026",
		genre: ["剧情", "动作"],
		cast: "김무열 / 이성민 / 진기주 / 표지훈",
		link: "https://www.netflix.com/",
		progress: 10,
		totalEpisodes: 10,
		startDate: "2026",
		endDate: "2026",
	},
	{
		title: "月鳞绮纪",
		status: "completed",
		rating: 8.6,
		cover: "/assets/anime/yuelinqiji.webp",
		description: "露芜衣是神秘组织无相月最小的九尾狐，在与姐姐雾妄言寻找在逃狐妖小唯的任务中，她潜入洛安城韦府，同时潜入韦府的还有身负血海深仇的武拾光、侍鳞宗法师寄灵与厉劫。在找寻真相的过程中，他们既有试探也有合作，但他们背后的目的各不相同，在一次又一次对龙神之力的争夺中，他们一次又一次改变命运的流向，为了守护人间和平，他们做出艰难的抉择割舍，并最终成功消灭万妖之首九婴，完成了对真爱与救赎的永恒追问。",
		episodes: "29 episodes",
		year: "2026",
		genre: ["古装", "玄幻"],
		cast: "鞠婧祎 / 曾舜晞 / 陈都灵 / 田嘉瑞",
		link: "https://so.youku.com/search/q_月鳞绮纪",
		progress: 29,
		totalEpisodes: 29,
		startDate: "2026",
		endDate: "2026",
	},
];

export default localAnimeList;
