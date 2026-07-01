// 友情链接数据配置
// 用于管理友情链接页面的数据

export interface FriendItem {
	id: number;
	title: string;
	imgurl: string;
	desc: string;
	siteurl: string;
	tags: string[];
}

// 友情链接数据
export const friendsData: FriendItem[] = [
	{
		id: 1,
		title: "辰渊尘站",
		imgurl: "https://blog.mcxiaochen.top/images/congyu/touxiang.webp",
		desc: "有志不在年高，无志空活百岁。",
		siteurl: "https://blog.mcxiaochen.top",
		tags: ["技术"],
	},
	{
		id: 2,
		title: "腾讯云",
		imgurl: "https://cloud.tencent.com/favicon.ico",
		desc: "云服务器+EdgeOne均来自于此",
		siteurl: "https://cloud.tencent.com/",
		tags: ["供应商"],
	},
];

// 获取所有友情链接数据
export function getFriendsList(): FriendItem[] {
	return friendsData;
}

// 获取随机排序的友情链接数据
export function getShuffledFriendsList(): FriendItem[] {
	const shuffled = [...friendsData];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}
