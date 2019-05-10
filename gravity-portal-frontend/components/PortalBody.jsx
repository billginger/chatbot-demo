import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home.jsx';
import BrandAdd from './BrandAdd.jsx';
import BrandDetail from './BrandDetail.jsx';
import BrandWechatBind from './BrandWechatBind.jsx';
import BrandFacebookBind from './BrandFacebookBind.jsx';
import Building from './Building.jsx';
import PortalColumn from './PortalColumn.jsx';
import NoMatch from './NoMatch.jsx';

const PortalBody = () => (
	<Switch>
		<Route exact path="/" component={Home} />
		<Route exact path="/brand" component={Building} />
		<Route exact path="/brand/add" component={BrandAdd} />
		<Route exact path="/brand/:id" component={BrandDetail} />
		<Route exact path="/brand/wechat/:id" component={Building} />
		<Route exact path="/brand/wechat/bind/:id" component={BrandWechatBind} />
		<Route exact path="/brand/wechat/unbind/:id" component={Building} />
		<Route exact path="/brand/facebook/:id" component={Building} />
		<Route exact path="/brand/facebook/bind/:id" component={BrandFacebookBind} />
		<Route exact path="/brand/facebook/unbind/:id" component={Building} />
		<Route path={['/dashboard', '/chatbot']} component={PortalColumn} />
		<Route component={NoMatch} />
	</Switch>
);

export default PortalBody;
