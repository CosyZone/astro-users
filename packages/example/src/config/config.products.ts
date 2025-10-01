import LinkConfig from "./config.link";

export const ProductConfig = {
	products: [
		{
			name: "登录",
			href: LinkConfig.getLoginPageLink("zh-cn"),
		},
		{
			name: "控制台",
			href: LinkConfig.getDashboardLink("zh-cn"),
		},
	],
};
