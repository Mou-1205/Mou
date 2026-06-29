import type { FooterConfig } from "../types/config";

// 页脚配置
export const footerConfig: FooterConfig = {
	enable: true, // 是否启用Footer HTML注入功能
	customHtml: '<a class="transition link text-[var(--primary)] font-medium" target="_blank" href="https://beian.miit.gov.cn/#/Integrated/index" rel="noopener noreferrer">粤ICP备2026081944号</a> | <a class="transition link text-[var(--primary)] font-medium inline-flex items-center gap-1" href="https://beian.mps.gov.cn/#/query/webSearch?code=44011402001354" rel="noreferrer" target="_blank"><img src="/assets/beian-icon.png" alt="公安备案" width="14" height="14">粤公网安备44011402001354号</a>', // HTML格式的自定义页脚信息，例如备案号等，默认留空
	// 也可以直接编辑 FooterConfig.html 文件来添加备案号等自定义内容
	// 注意：若 customHtml 不为空，则使用 customHtml 中的内容；若 customHtml 留空，则使用 FooterConfig.html 文件中的内容
	// FooterConfig.html 可能会在未来的某个版本弃用
};
