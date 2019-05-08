import React from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Breadcrumb, Typography } from 'antd';
import PortalContent from './PortalContent.jsx';
const { Text } = Typography;

class BrandWechatBind extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			errMsg: ''
		}
	}
	componentDidMount() {
		const id = this.props.match.params.id;
		fetch(`/api/brand/wechat/bind/${id}`).then(res => (
			res.ok ? res.json() : Promise.reject(res)
		)).then(data => {
			console.log(data);
			this.props.history.push(data.url);
		}).catch(err => {
			const errMsg = err.statusText || err;
			this.setState({ errMsg });
		});
	}
	render() {
		const i18n = this.props.intl.messages;
		const { errMsg } = this.state;
		// Breadcrumb
		const breadcrumb = (
			<React.Fragment>
				<Breadcrumb.Item>{i18n.system}</Breadcrumb.Item>
				<Breadcrumb.Item><Link to="/brand">{i18n.brand}</Link></Breadcrumb.Item>
				<Breadcrumb.Item>{i18n.brandWechatAccount}</Breadcrumb.Item>
				<Breadcrumb.Item>{i18n.brandBind}</Breadcrumb.Item>
			</React.Fragment>
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
			<p>{i18n.brandWechatRedirecting}</p>
		);
		return (
			<PortalContent breadcrumb={breadcrumb} content={content} />
		);
	}
}

export default injectIntl(BrandWechatBind);
