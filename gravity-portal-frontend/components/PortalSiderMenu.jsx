import React from 'react';
import { injectIntl } from 'react-intl';
import { withRouter, Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';

const PortalSiderMenu = ({ intl, location }) => {
	const i18n = intl.messages;
	return (
		<Menu theme="dark" selectedKeys={[location.pathname]}>
			<Menu.Item key="/dashboard">
				<Link to="/dashboard">
					<Icon type="dashboard" />{i18n.dashboard}
				</Link>
			</Menu.Item>
		</Menu>
	);
};

export default injectIntl(withRouter(PortalSiderMenu));
