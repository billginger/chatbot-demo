import React from 'react';
import { Layout } from 'antd';
const { Content, Footer } = Layout;

const PortalContent = ({ breadcrumb, content }) => (
	<Layout>
		<Content id="tc-portal-content">
			<div id="tc-portal-breadcrumb">
				{breadcrumb}
			</div>
			<div id="tc-portal-main">
				{content}
			</div>
		</Content>
		<Footer id="tc-portal-footer">
			Chatbot Demo © 2019 Created by Bill
		</Footer>
	</Layout>
);

export default PortalContent;
