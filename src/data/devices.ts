// 设备数据配置文件

export interface Device {
	name: string;
	image: string;
	specs: string;
	description: string;
	link: string;
}

// 设备类别类型，支持品牌和自定义类别
export type DeviceCategory = Record<string, Device[]> & {
	自定义?: Device[];
};

export const devicesData: DeviceCategory = {
	Xiaomi: [
		{
			name: "Xiaomi 15",
			image: "/images/device/xiaomi15.webp",
			specs: "16GB+512GB",
			description: "Powered by Snapdragon 8 Elite, featuring Leica Summilux optical lenses, 5400mAh battery with 90W wired and 50W wireless charging, runs Xiaomi HyperOS.",
			link: "https://www.mi.com/prod/xiaomi-15",
		},
	],
};
