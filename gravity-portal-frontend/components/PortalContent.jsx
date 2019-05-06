import React from 'react';
import { Layout, Breadcrumb } from 'antd';
const { Content } = Layout;

const PortalContent = ({breadcrumb, content}) => (
	<Content id="tc-portal-content">
		<Breadcrumb className="tc-portal-breadcrumb">
			{breadcrumb}
		</Breadcrumb>
		<div id="tc-portal-main">
			{content}
		</div>
	</Content>
);

export default PortalContent;
