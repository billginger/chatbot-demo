import React from 'react';
import { injectIntl } from 'react-intl';
import { withRouter, Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';

const PortalSiderMenu = ({ intl, location }) => {
	const i18n = intl.messages;
	const botChatMenuTitle = (
		<React.Fragment>
			<Icon type="robot" />{i18n.botChat}
		</React.Fragment>
	);
	return (
		<Menu theme="dark" selectedKeys={[location.pathname]}>
			<Menu.Item key="/dashboard">
				<Link to="/dashboard">
					<Icon type="dashboard" />{i18n.dashboard}
				</Link>
			</Menu.Item>
			<Menu.SubMenu title={botChatMenuTitle}>
				<Menu.Item key="/bot/config">
					<Link to="/bot/config">{i18n.botChatConfig}</Link>
				</Menu.Item>
				<Menu.Item key="/bot/rule">
					<Link to="/bot/rule">{i18n.botChatRule}</Link>
				</Menu.Item>
				<Menu.Item key="/bot/train">
					<Link to="/bot/train">{i18n.botChatTrain}</Link>
				</Menu.Item>
				<Menu.Item key="/bot/manual">
					<Link to="/bot/manual">{i18n.botChatManual}</Link>
				</Menu.Item>
			</Menu.SubMenu>
		</Menu>
	);
};

export default injectIntl(withRouter(PortalSiderMenu));
