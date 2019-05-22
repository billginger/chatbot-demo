import React from 'react';
import { injectIntl } from 'react-intl';
import { withRouter, Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';

const PortalSiderMenu = ({ intl, location }) => {
	const i18n = intl.messages;
	const chatbotMenuTitle = (
		<React.Fragment>
			<Icon type="robot" />{i18n.chatbot}
		</React.Fragment>
	);
	return (
		<Menu theme="dark" selectedKeys={[location.pathname]}>
			<Menu.Item key="/dashboard">
				<Link to="/dashboard">
					<Icon type="dashboard" />{i18n.dashboard}
				</Link>
			</Menu.Item>
			<Menu.SubMenu title={chatbotMenuTitle}>
				<Menu.Item key="/chatbot/config">
					<Link to="/chatbot/config">{i18n.chatbotConfig}</Link>
				</Menu.Item>
				<Menu.Item key="/chatbot/rule">
					<Link to="/chatbot/rule">{i18n.chatbotRule}</Link>
				</Menu.Item>
				<Menu.Item key="/chatbot/train">
					<Link to="/chatbot/train">{i18n.chatbotTrain}</Link>
				</Menu.Item>
				<Menu.Item key="/chatbot/manual">
					<Link to="/chatbot/manual">{i18n.chatbotManual}</Link>
				</Menu.Item>
			</Menu.SubMenu>
		</Menu>
	);
};

export default injectIntl(withRouter(PortalSiderMenu));
