import React from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Breadcrumb, Typography, Icon } from 'antd';
import PortalContent from './PortalContent.jsx';
const { Text } = Typography;

class BrandFacebookBind extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			errMsg: ''
		}
	}
	componentDidMount() {
		const id = this.props.match.params.id;
		fetch(`/api/brand/facebook/bind/${id}`).then(res => (
			res.ok ? this.props.history.push(`/brand/${id}`) : Promise.reject(res)
		)).catch(err => {
			const errMsg = err.statusText || err;
			this.setState({ errMsg });
		});
	}
	render() {
		const i18n = this.props.intl.messages;
		const { errMsg } = this.state;
		// Breadcrumb
		const breadcrumb = (
			<Breadcrumb>
				<Breadcrumb.Item>{i18n.system}</Breadcrumb.Item>
				<Breadcrumb.Item><Link to="/brand">{i18n.brand}</Link></Breadcrumb.Item>
				<Breadcrumb.Item>Facebook</Breadcrumb.Item>
				<Breadcrumb.Item>{i18n.brandBind}</Breadcrumb.Item>
			</Breadcrumb>
		);
		// Error
		if (errMsg) {
			const warnMessage = i18n[errMsg] || i18n.msgError;
			const warnText = (
				<Text type="warning">{warnMessage}</Text>
			);
			return (
				<PortalContent breadcrumb={breadcrumb} content={warnText} />
			);
		}
		// Page
		const content = (
			<Icon type="loading" />
		);
		return (
			<PortalContent breadcrumb={breadcrumb} content={content} />
		);
	}
}

export default injectIntl(BrandFacebookBind);
