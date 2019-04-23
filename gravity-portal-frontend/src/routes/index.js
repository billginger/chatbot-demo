const routes = {
	'/': { i18n: 'home', component: 'Home' },
	'/brand': { i18n: 'brand', component: 'Building' },
	'/brand/add': { i18n: 'actionAdd', component: 'Building' },
	'/system': { i18n: 'system', to: '/system/user' },
	'/system/user': { i18n: 'systemUser', component: 'Building' },
	'/system/setting': { i18n: 'systemSetting', component: 'Building' }
};

export default routes;
