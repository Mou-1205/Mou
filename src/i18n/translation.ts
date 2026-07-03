import type I18nKey from "./i18nKey";
import { zh_CN } from "./languages/zh_CN";

export type Translation = Record<I18nKey, string>;

export function i18n(key: I18nKey): string {
	return zh_CN[key];
}
