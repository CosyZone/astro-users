import { defaultLogger, type INavItem, LangPackage } from "@coffic/cosy-ui";
import LinkConfig from "./config.link";

export const AppConfig = {
	session_key: "kuaiyizhi-session",

	companyName: LangPackage.setZh("Coffic 工作室").setEn(
		"Coffic Studio",
	),

	icp: LangPackage.setZh("鲁ICP备2022009149号-2").setEn(
		"ICP License: 2022009149-2",
	),
	slogan: LangPackage.setZh("从学习中寻找快乐").setEn("Find Joy in Learning"),
	inspirationalSlogan: LangPackage.setZh("也许，这是一番成就的开始").setEn(
		"Perhaps, this is the beginning of achievement",
	),
	copyright: LangPackage.setZh("版权所有").setEn("All rights reserved"),
	keywords: "Cisum,GitOk,TravelMode,Netto,CosyUI,快易知",
	siteName: "用户管理系统",

	getNavItems(lang: string) {
		return [
			{
				href: '/',
				title: lang === 'zh' ? "首页" : "Home",
			},
		];
	},

	socialLinks: ["https://github.com/CofficLab"],
};