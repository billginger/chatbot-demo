import React from 'react';
import { injectIntl } from 'react-intl';
import { withRouter, Link } from 'react-router-dom';
import { Menu, Icon, Modal, message } from 'antd';

class PortalMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			errMsg: '',
			profile: {}
		}
	}
	componentDidMount() {
		fetch('/api/user/profile').then(res => (
			res.ok ? res.json() : Promise.reject(res)
		)).then(profile => {
			this.setState({
				profile
			});
		}).catch(err => {
			const errMsg = err.statusText || err;
			this.setState({
				errMsg
			});
		});
	}
	render() {
		const { intl, location } = this.props;
		const { errMsg, profile } = this.state;
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
		if (errMsg) {
			message.warning(i18n[errMsg] || i18n.msgError);
		}
		if (!profile.name) {
			return '';
		}
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
				<Menu.SubMenu title={<div><Icon type="user" />{profile.name}</div>}>
					<Menu.Item onClick={confirmLogout}>
						{i18n.userLogout}
					</Menu.Item>
				</Menu.SubMenu>
			</Menu>
		);
	}
}

export default injectIntl(withRouter(PortalMenu));
