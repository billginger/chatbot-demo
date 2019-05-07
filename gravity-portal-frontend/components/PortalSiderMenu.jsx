import React from 'react';
import { Menu } from 'antd';

const PortalColumn = ({ intl, location }) => {
	const i18n = intl.messages;
	return (
		<Menu selectedKeys={[location.pathname]}>
			<Menu.Item key="/dashboard">
				<Link to="/dashboard">
					<Icon type="dashboard" />{i18n.dashboard}
				</Link>
			</Menu.Item>
		</Menu>
	);
};

export default PortalColumn;
