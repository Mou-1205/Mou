/**
 * 中文数字字符集
 * 用于 TOC 徽章显示
 */

/**
 * 中文数字字符集（30 个字符）
 */
export const CHINESE_NUMBERS = [
	"一",
	"二",
	"三",
	"四",
	"五",
	"六",
	"七",
	"八",
	"九",
	"十",
	"十一",
	"十二",
	"十三",
	"十四",
	"十五",
	"十六",
	"十七",
	"十八",
	"十九",
	"二十",
	"二十一",
	"二十二",
	"二十三",
	"二十四",
	"二十五",
	"二十六",
	"二十七",
	"二十八",
	"二十九",
	"三十",
] as const;

export type ChineseNumberChar = (typeof CHINESE_NUMBERS)[number];

/**
 * 获取 TOC 徽章文本
 * @param index - 索引（从 0 开始）
 * @param useChinese - 是否使用中文数字
 * @returns 徽章文本
 */
export function getChineseBadge(index: number, useChinese: boolean): string {
	if (useChinese && index < CHINESE_NUMBERS.length) {
		return CHINESE_NUMBERS[index];
	}
	return (index + 1).toString();
}

/**
 * 获取可用的中文数字数量
 */
export const CHINESE_NUMBERS_COUNT = CHINESE_NUMBERS.length;
