import React from 'react';
import { injectIntl } from 'react-intl';
import { withRouter, Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';

const PortalSiderMenu = ({ intl, location }) => {
	const i18n = intl.messages;
	const chatBotMenuTitle = (
		<React.Fragment>
			<Icon type="robot" />{i18n.chatBot}
		</React.Fragment>
	);
	return (
		<Menu theme="dark" selectedKeys={[location.pathname]}>
			<Menu.Item key="/dashboard">
				<Link to="/dashboard">
					<Icon type="dashboard" />{i18n.dashboard}
				</Link>
			</Menu.Item>
			<Menu.SubMenu title={chatBotMenuTitle}>
				<Menu.Item key="/chat/config">
					<Link to="/chat/config">{i18n.chatBotConfig}</Link>
				</Menu.Item>
				<Menu.Item key="/chat/rule">
					<Link to="/chat/rule">{i18n.chatBotRule}</Link>
				</Menu.Item>
				<Menu.Item key="/chat/train">
					<Link to="/chat/train">{i18n.chatBotTrain}</Link>
				</Menu.Item>
				<Menu.Item key="/chat/manual">
					<Link to="/chat/manual">{i18n.chatBotManual}</Link>
				</Menu.Item>
			</Menu.SubMenu>
		</Menu>
	);
};

export default injectIntl(withRouter(PortalSiderMenu));
