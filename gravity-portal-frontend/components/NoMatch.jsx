import React from 'react';
import { Layout } from 'antd';
const { Content } = Layout;

const NoMatch = () => (
	<Content id="tc-portal-content">
		<div className="tc-portal-breadcrumb" />
		<div id="tc-portal-main">
			<p>404</p>
		</div>
	</Content>
);

export default NoMatch;
