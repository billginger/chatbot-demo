import React from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Layout, Breadcrumb, Typography, Icon } from 'antd';
const { Content } = Layout;
const { Text } = Typography;

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			errMsg: '',
			data: ''
		}
	}
	componentDidMount() {
		fetch('/api/system/home').then(res => (
			res.ok ? res.json() : Promise.reject(res)
		)).then(data => {
			this.setState({ data });
		}).catch(err => {
			const errMsg = err.statusText || err;
			this.setState({ errMsg });
		});
	}
	render() {
		const i18n = this.props.intl.messages;
		const { errMsg, data } = this.state;
		// Error
		if (errMsg) {
			const warnMessage = i18n[errMsg] || i18n.msgError;
			return (
				<Text type="warning">{warnMessage}</Text>
			);
		}
		// Loading
		if (!data) {
			return (
				<Icon type="loading" />
			);
		}
		// Page
		return (
			<Content id="tc-portal-content">
				<Breadcrumb className="tc-portal-breadcrumb">
					<Breadcrumb.Item key="home">
						<Link to="/">test</Link>
					</Breadcrumb.Item>
				</Breadcrumb>
				<div id="tc-portal-main">
					<p>Weclome to Gravity Prototype!</p>
				</div>
			</Content>
		);
	}
}

export default injectIntl(Home);
