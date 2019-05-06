import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Home from './Home.jsx';
import BrandAdd from './BrandAdd.jsx';
import BrandDetail from './BrandDetail.jsx';
import Building from './Building.jsx';
import NoMatch from './NoMatch.jsx';

const PortalRoutes = () => (
	<Layout>
		<Switch>
			<Route exact path="/" component={Home} />
			<Route exact path="/brand" component={Building} />
			<Route exact path="/brand/add" component={BrandAdd} />
			<Route exact path="/brand/:id" component={BrandDetail} />
			<Route component={NoMatch} />
		</Switch>
	</Layout>
);

export default PortalRoutes;
