import { defaultLogger, type INavItem, LangPackage } from "@coffic/cosy-ui";
import LinkConfig from "./config.link";

export const AppConfig = {
	session_key: "kuaiyizhi-session",

	companyName: LangPackage.setZh("青岛岳亿网络科技有限公司").setEn(
		"Qingdao Yueyi Network Technology Co., Ltd.",
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
	siteName: "快易知",

	getNavItems(lang: string) {
		return [
			{
				href: '/',
				title: "Home",
			},
			{
				href: '/admin',
				title: "Admin",
			},
		];
	},

	socialLinks: ["https://github.com/CofficLab"],
};
