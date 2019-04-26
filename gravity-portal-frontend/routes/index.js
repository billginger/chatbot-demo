const routes = {
	'/': { i18n: 'home', component: 'Home' },
	'/brand': { i18n: 'brand', component: 'Building' },
	'/brand/add': { i18n: 'labelAdd', component: 'BrandAdd' },
	'/brand/:id': { i18n: 'labelDetail', component: 'Building' },
	'/system': { i18n: 'system', to: '/system/user' },
	'/system/user': { i18n: 'systemUser', component: 'Building' },
	'/system/setting': { i18n: 'systemSetting', component: 'Building' }
};

export default routes;
