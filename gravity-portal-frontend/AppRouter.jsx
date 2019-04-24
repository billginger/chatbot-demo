import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './components/Login.jsx';
import Portal from './components/Portal.jsx';
import './less/style.less';

const AppRouter = () => (
	<Router>
		<Switch>
			<Route path="/login" component={Login} />
			<Route component={Portal} />
		</Switch>
	</Router>
);

export default AppRouter;
