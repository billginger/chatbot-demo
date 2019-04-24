import React from 'react';
import { injectIntl } from 'react-intl';
import { withRouter, Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import routes from '../routes';

const PortalBreadcrumb = ({ intl, location }) => {
	const i18n = intl.messages;
	let pathSnippets = [];
	if (routes[location.pathname]) {
		pathSnippets = location.pathname.split('/').filter(i => i);
	}
	const breadcrumbItems = pathSnippets.map((_, index) => {
		const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
		return (
			<Breadcrumb.Item key={url}>
				<Link to={url}>
					{i18n[routes[url].i18n]}
				</Link>
			</Breadcrumb.Item>
		);
	});
	return (
		<Breadcrumb className="tc-portal-breadcrumb">
			<Breadcrumb.Item key="home">
				<Link to="/">{i18n.home}</Link>
			</Breadcrumb.Item>
			{breadcrumbItems}
		</Breadcrumb>
	);
};

export default injectIntl(withRouter(PortalBreadcrumb));
