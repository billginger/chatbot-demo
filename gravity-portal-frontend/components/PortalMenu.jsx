import React from 'react';
import { injectIntl } from 'react-intl';
import { withRouter, Link } from 'react-router-dom';
import { Menu, Icon, Modal } from 'antd';

const PortalMenu = ({ intl, location }) => {
	const i18n = intl.messages;
	const confirmLogout = () => {
		Modal.confirm({
			title: i18n.modalConfirmTitle,
			content: intl.formatMessage(
				{ id: 'modalConfirmBody' },
				{ action: i18n.userLogout, target: '' }
			),
			onOk() {
				window.location.href = '/api/user/logout';
			}
		});
	};
	return (
		<Menu id="tc-portal-menu" theme="dark" mode="horizontal" selectedKeys={[location.pathname]}>
			<Menu.Item key="/">
				<Link to="/">
					<Icon type="home" />{i18n.home}
				</Link>
			</Menu.Item>
			<Menu.Item key="/brand/add">
				<Link to="/brand/add">
					<Icon type="book" />{i18n.brandAdd}
				</Link>
			</Menu.Item>
			<Menu.SubMenu title={<div><Icon type="user" />Bill</div>}>
				<Menu.Item onClick={confirmLogout}>
					{i18n.userLogout}
				</Menu.Item>
			</Menu.SubMenu>
		</Menu>
	);
};

export default injectIntl(withRouter(PortalMenu));
