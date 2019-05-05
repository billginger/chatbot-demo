const routes = {
	'/': { i18n: 'home', component: 'Home' },
	'/brand': { i18n: 'brand', component: 'Building' },
	'/brand/add': { i18n: 'labelAdd', component: 'BrandAdd' },
	'/brand/:id': { component: 'BrandDetail' },
	'/system': { i18n: 'system', to: '/system/user' },
	'/system/user': { i18n: 'systemUser', component: 'Building' },
	'/system/setting': { i18n: 'systemSetting', component: 'Building' },
	'/dashboard': { i18n: 'dashboard', component: 'Building' },
	'/dashboard/redirect': { to: '/dashboard' }
};

export default routes;
