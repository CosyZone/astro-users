import { LinkUtil } from "@coffic/cosy-ui";

export const configApp = {
	homeLink: LinkUtil.getBaseUrl(),
	basePath: LinkUtil.getBaseUrl(),
	getNavItems: (lang: string) => [
		{
			href: `${LinkUtil.getBaseUrl()}${lang}`,
			title: "Home",
		},
		{
			href: `${LinkUtil.getBaseUrl()}${lang}/manuals`,
			title: "Docs",
		},
		{
			href: `/users`,
			title: "用户管理",
		},
		{
			href: `${LinkUtil.getBaseUrl()}${lang}/admin`,
			title: "控制台1",
		},
		{
			href: `${LinkUtil.getBaseUrl()}${lang}/dashboard`,
			title: "控制台2",
		},
	],
};
