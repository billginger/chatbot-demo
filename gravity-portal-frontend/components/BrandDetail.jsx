import React from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Breadcrumb, Typography, Icon, Row, Col } from 'antd';
import { withTimeZone, getLocalDate } from '../utils/date.js';
import PortalContent from './PortalContent.jsx';
const { Text } = Typography;

class BrandDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			errMsg: '',
			data: ''
		}
	}
	componentDidMount() {
		const id = this.props.match.params.id;
		fetch(`/api/brand/${id}`).then(res => (
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
		// Breadcrumb
		const breadcrumb = (
			<React.Fragment>
				<Breadcrumb.Item>{i18n.system}</Breadcrumb.Item>
				<Breadcrumb.Item><Link to="/brand">{i18n.brand}</Link></Breadcrumb.Item>
				<Breadcrumb.Item>{i18n.labelDetail}</Breadcrumb.Item>
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
		// Loading
		if (!data) {
			const loading = (
				<Icon type="loading" />
			);
			return (
				<PortalContent breadcrumb={breadcrumb} content={loading} />
			);
		}
		// Handle
		const handleDelete = e => {
			console.log(e);
		};
		const handleBind = e => {
			console.log(e);
		};
		// Page
		const content = (
			<React.Fragment>
				<div id="tc-page-header">
					<h1>{data.name}</h1>
					<Link to={`/brand/edit/${data._id}`}>{i18n.actionEdit}</Link>
					<a onClick={handleDelete}>{i18n.actionDelete}</a>
				</div>
				<div id="tc-page-main">
					<Row>
						<Col span={6}>
							{i18n.brandWechatAccount}
						</Col>
						<Col span={18}>
							{i18n.brandUnbound}
							<a onClick={handleBind}>{i18n.actionBind}</a>
						</Col>
					</Row>
					<Row>
						<Col span={6}>
							Facebook
						</Col>
						<Col span={18}>
							{i18n.brandUnbound}
							<a onClick={handleBind}>{i18n.actionBind}</a>
						</Col>
					</Row>
					<Row>
						<Col span={6}>
							{i18n.labelCreatedBy}
						</Col>
						<Col span={18}>
							{data.createdBy}
						</Col>
					</Row>
					<Row>
						<Col span={6}>
							{withTimeZone(i18n.labelCreatedAt)}
						</Col>
						<Col span={18}>
							{getLocalDate(data.createdAt)}
						</Col>
					</Row>
				</div>
			</React.Fragment>
		);
		return (
			<PortalContent breadcrumb={breadcrumb} content={content} />
		);
	}
}

export default injectIntl(BrandDetail);
