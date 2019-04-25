import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import routes from '../routes';
import Home from './Home.jsx';
import BrandAdd from './BrandAdd.jsx';
import Building from './Building.jsx';
import NoMatch from './NoMatch.jsx';

const subpages = {
	Home,
	BrandAdd,
	Building
}

let portalRoutes = [];
for (let key in routes) {
	if (routes[key].component) {
		portalRoutes.push(
			<Route exact key={key} path={key} component={subpages[routes[key].component]} />
		);
	}
	if (routes[key].to) {
		portalRoutes.push(
			<Redirect exact key={key} from={key} to={routes[key].to} />
		);
	}
}

const PortalRoutes = () => (
	<div id="tc-portal-main">
		<Switch>
			{portalRoutes}
			<Route component={NoMatch} />
		</Switch>
	</div>
);

export default PortalRoutes;
