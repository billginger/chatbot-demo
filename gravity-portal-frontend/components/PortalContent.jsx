import React from 'react';
import { Layout, Breadcrumb } from 'antd';
const { Content } = Layout;

const PortalContent = ({ breadcrumb, content }) => (
	<React.Fragment>
		<Content id="tc-portal-content">
			<Breadcrumb className="tc-portal-breadcrumb">
				{breadcrumb}
			</Breadcrumb>
			<div id="tc-portal-main">
				{content}
			</div>
		</Content>
		<Footer id="tc-portal-footer">
			Gravity Prototype © 2019 Created by Bill
		</Footer>
	</React.Fragment>
);

export default PortalContent;
