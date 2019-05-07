import React from 'react';
import { Layout } from 'antd';
import LanguageMenu from './LanguageMenu.jsx';
import PortalHeaderMenu from './PortalHeaderMenu.jsx';
import PortalBody from './PortalBody.jsx';
const { Header, Footer } = Layout;

const Portal = () => (
	<Layout>
		<Header>
			<h1 id="tc-portal-title">Gravity Prototype</h1>
			<LanguageMenu id="tc-portal-language" theme="dark" />
			<PortalHeaderMenu />
		</Header>
		<PortalBody />
	</Layout>
);

export default Portal;
