import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';
import PortalSiderMenu from './PortalSiderMenu.jsx';
import NoMatch from './NoMatch.jsx';
const { Sider } = Layout;

const PortalColumn = () => (
	<Layout>
		<Sider>
			<PortalSiderMenu />
		</Sider>
		<Switch>
			<Route component={NoMatch} />
		</Switch>
	</Layout>
);

export default PortalColumn;
