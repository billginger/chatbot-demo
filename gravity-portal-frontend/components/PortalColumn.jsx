import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';
import NoMatch from './NoMatch.jsx';
const { Sider } = Layout;

const PortalRoutes = () => (
	<Layout>
		<Sider>Sider</Sider>
		<Switch>
			<Route component={NoMatch} />
		</Switch>
	</Layout>
);

export default PortalRoutes;
