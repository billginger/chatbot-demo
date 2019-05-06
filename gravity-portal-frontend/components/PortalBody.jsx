import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Breadcrumb } from 'antd';
const { Content } = Layout;

const PortalBody = () => (
	<Layout>
		<Content id="tc-portal-content">
			<Breadcrumb className="tc-portal-breadcrumb">
				<Breadcrumb.Item key="home">
					<Link to="/">test</Link>
				</Breadcrumb.Item>
			</Breadcrumb>
			<div id="tc-portal-main">
				<p>test</p>
			</div>
		</Content>
	</Layout>
);

export default PortalBody;
