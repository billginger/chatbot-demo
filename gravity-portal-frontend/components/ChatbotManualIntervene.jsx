import React from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Breadcrumb, Typography, Icon, List, Tag, Form, Input, Button, Alert, Modal } from 'antd';
import PortalContent from './PortalContent.jsx';
const { Text } = Typography;

class ChatbotManualIntervene extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			errMsg: '',
			data: '',
			isClosed: false,
			alertMsg: '',
			buttonLoading: false
		}
	}
	componentDidMount() {
		const id = this.props.match.params.id;
		fetch(`/api/chatbot/manual/${id}`).then(res => (
			res.ok ? res.json() : Promise.reject(res)
		)).then(data => {
			this.setState({ data }, () => {
				const ele = document.getElementsByClassName('ant-spin-container')[0];
				ele.scrollTop = ele.scrollHeight;
			});
		}).catch(err => {
			const errMsg = err.statusText || err;
			this.setState({ errMsg });
		});
	}
	render() {
		const i18n = this.props.intl.messages;
		const { getFieldDecorator, validateFields } = this.props.form;
		const { errMsg, data, isClosed, alertMsg, buttonLoading } = this.state;
		// Breadcrumb
		const breadcrumb = (
			<Breadcrumb>
				<Breadcrumb.Item>{i18n.chatbot}</Breadcrumb.Item>
				<Breadcrumb.Item><Link to="/chatbot/manual">{i18n.chatbotManual}</Link></Breadcrumb.Item>
				<Breadcrumb.Item>{i18n.chatbotManualDialogue}</Breadcrumb.Item>
			</Breadcrumb>
		);
		// Closed
		if (isClosed) {
			const closedText = (
				<p>{i18n.chatbotManualDialogueClosed}</p>
			);
			return (
				<PortalContent breadcrumb={breadcrumb} content={closedText} />
			);
		}
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
		// Form Alert
		let alertMessage;
		if (alertMsg) {
			alertMessage = i18n[alertMsg] || i18n.msgError;
		}
		const formAlert = (
			alertMessage && <Alert className="tc-form-alert" message={alertMessage} type="error" />
		);
		// Handle
		const handleSubmit = e => {
			const action = e.target.textContent;
		};
		const handleClose = e => {
			const action = e.target.textContent;
		};
		const handleInputChange = () => {
			this.setState({ alertMsg: '' });
		};
		// Page
		const listFooter = (
			<Form onSubmit={handleSubmit}>
				<Form.Item style={{margin:0}}>
					{getFieldDecorator('content', {
						rules: [{ required: true, message: i18n.msgNeedInput, whitespace: true }]
					})(
						<Input.TextArea onChange={handleInputChange} autosize={{ minRows: 2, maxRows: 4 }} />
					)}
				</Form.Item>
				<Form.Item style={{margin:0}}>
					{formAlert}
					<Button type="primary" htmlType="submit" loading={buttonLoading}>
						{i18n.chatbotManualDialogueSend}
					</Button>
					<Button className="tc-dealogue-button" onClick={handleClose}>
						{i18n.chatbotManualDialogueClose}
					</Button>
				</Form.Item>
			</Form>
		);
		const content = (
			<List
				className="tc-dialogue"
				bordered
				header={i18n.chatbotManualDialogueChatting}
				footer={listFooter}
				dataSource={data}
				renderItem={item => {
					let color = '#2db7f5';
					let className = 'tc-dealogue-content-left';
					if (item.direction != 1) {
						color = '#87d068';
						className = 'tc-dealogue-content-right';
					}
					return (
						<List.Item>
							<Tag color={color} className={className}>{item.content}</Tag>
						</List.Item>
					);
				}}
			/>
		);
		return (
			<PortalContent breadcrumb={breadcrumb} content={content} />
		);
	}
}

export default injectIntl(Form.create()(ChatbotManualIntervene));
