import LinkConfig from "./config.link";

export const ProductConfig = {
	products: [
		{
			name: "登录",
			href: LinkConfig.getLoginPageLink("zh-cn"),
		},
		{
			name: "注册",
			href: LinkConfig.getSignupLink("zh-cn"),
		},
		{
			name: "用户管理",
			href: '/users',
		},
	],
};
