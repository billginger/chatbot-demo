import React from 'react';
import { injectIntl } from 'react-intl';
import { withRouter, Link } from 'react-router-dom';
import { Menu, Icon, Modal, message } from 'antd';

class PortalMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: '',
			brands: []
		}
	}
	componentDidMount() {
		fetch('/api/user/profile').then(res => (
			res.ok ? res.json() : Promise.reject(res)
		)).then(user => {
			this.setState({ user });
		}).catch(err => {
			const i18n = this.props.intl.messages;
			const errMsg = err.statusText || err;
			message.warning(i18n[errMsg] || i18n.msgError);
		});
		fetch('/api/brand').then(res => (
			res.ok ? res.json() : Promise.reject(res)
		)).then(brands => {
			this.setState({ brands });
		});
	}
	render() {
		const { intl, location } = this.props;
		const { user, brands } = this.state;
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
		if (!user) {
			return '';
		}
		// Brand Menu
		let brandMenu = (
			<Menu.Item>
				<Link to="/brand/add">
					<Icon type="book" />{i18n.brandAdd}
				</Link>
			</Menu.Item>
		);
		if (brands.length) {
			brandMenu = (
				<Menu.SubMenu title={<div><Icon type="book" />{i18n.brand}</div>}>
					{brands.map(item => (
						<Menu.Item key={item._id}>
							{item.name}
						</Menu.Item>
					))}
				</Menu.SubMenu>
			);
		}
		return (
			<Menu id="tc-portal-menu" theme="dark" mode="horizontal" selectedKeys={[location.pathname]}>
				<Menu.Item>
					<Link to="/">
						<Icon type="home" />{i18n.home}
					</Link>
				</Menu.Item>
				{brandMenu}
				<Menu.SubMenu title={<div><Icon type="user" />{user.name}</div>}>
					<Menu.Item onClick={confirmLogout}>
						{i18n.userLogout}
					</Menu.Item>
				</Menu.SubMenu>
			</Menu>
		);
	}
}

export default injectIntl(withRouter(PortalMenu));
