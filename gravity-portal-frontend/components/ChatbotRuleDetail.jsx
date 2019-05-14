import React from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Breadcrumb, Typography, Icon, Row, Col, Tag } from 'antd';
import { withTimeZone, getLocalDate } from '../utils/date.js';
import PortalContent from './PortalContent.jsx';
const { Text } = Typography;

class ChatbotRuleDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			errMsg: '',
			data: ''
		}
	}
	componentDidMount() {
		const id = this.props.match.params.id;
		fetch(`/api/chatbot/rule/${id}`).then(res => (
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
			<Breadcrumb>
				<Breadcrumb.Item>{i18n.chatbot}</Breadcrumb.Item>
				<Breadcrumb.Item><Link to="/chatbot/rule">{i18n.chatbotRule}</Link></Breadcrumb.Item>
				<Breadcrumb.Item>{i18n.labelDetail}</Breadcrumb.Item>
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
		// Page
		const colors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
		const randomColor = () => (
			colors[parseInt(Math.random() * 10)]
		);
		const content = (
			<React.Fragment>
				<div id="tc-page-header">
					<h1>{data.name}</h1>
					<Link to={`/chatbot/rule/edit/${data._id}`}>{i18n.actionEdit}</Link>
					<a onClick={handleDelete}>{i18n.actionDelete}</a>
				</div>
				<div id="tc-page-main">
					<Row>
						<Col span={6}>
							{i18n.chatbotRuleKeyword}
						</Col>
						<Col span={18}>
							{data.keywords.map((item, key) => (
								<Tag key={key} color={randomColor()}>{item}</Tag>
							))}
						</Col>
					</Row>
					<Row>
						<Col span={6}>
							{i18n.chatbotRuleReplyContent}
						</Col>
						<Col span={18}>
							{JSON.stringify(data.replyContent)}
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

export default injectIntl(ChatbotRuleDetail);
