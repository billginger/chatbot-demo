import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Layout } from 'antd';
import PortalSiderMenu from './PortalSiderMenu.jsx';
import Dashboard from './Dashboard.jsx';
import NoMatch from './NoMatch.jsx';
const { Sider } = Layout;

const PortalColumn = () => (
	<Layout id="tc-portal-column">
		<Sider width={240}>
			<PortalSiderMenu />
		</Sider>
		<Switch>
			<Redirect exact from="/dashboard/redirect" to="/dashboard" />
			<Route exact path="/dashboard" component={Dashboard} />
			<Route component={NoMatch} />
		</Switch>
	</Layout>
);

export default PortalColumn;