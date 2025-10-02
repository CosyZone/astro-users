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
			href: `${LinkUtil.getBaseUrl()}${lang}/dashboard1`,
			title: "控制台1",
		},
		{
			href: `${LinkUtil.getBaseUrl()}${lang}/dashboard2`,
			title: "控制台2",
		},
		{
			href: `${LinkUtil.getBaseUrl()}${lang}/dashboard3`,
			title: "控制台3",
		},
	],
};
