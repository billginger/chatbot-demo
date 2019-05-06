import React from 'react';
import { Layout } from 'antd';
import LanguageMenu from './LanguageMenu.jsx';
import PortalMenu from './PortalMenu.jsx';
import PortalRoutes from './PortalRoutes.jsx';
const { Header, Footer } = Layout;

const Portal = () => (
	<Layout>
		<Header>
			<h1 id="tc-portal-title">Gravity Prototype</h1>
			<LanguageMenu id="tc-portal-language" theme="dark" />
			<PortalMenu />
		</Header>
		<PortalRoutes />
		<Footer id="tc-portal-footer">
			Gravity Prototype © 2019 Created by Bill
		</Footer>
	</Layout>
);

export default Portal;
