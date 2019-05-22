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
	refreshDialogues() {
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
	componentDidMount() {
		this.refreshDialogues();
		this.timer = setInterval(() => { this.refreshDialogues() }, 5000);
	}
	componentWillUnmount() {
		this.timer && clearTimeout(this.timer);
	}
	render() {
		const i18n = this.props.intl.messages;
		const { getFieldDecorator, validateFields, resetFields } = this.props.form;
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
		const sendSuccess = () => {
			resetFields();
			this.setState({ buttonLoading: false }, () => {
				this.refreshDialogues();
			});
		}
		const handleSubmit = e => {
			e.preventDefault();
			validateFields((err, values) => {
				if (err) return;
				this.setState({ buttonLoading: true });
				const id = this.props.match.params.id;
				fetch(`/api/chatbot/manual/send/${id}`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(values)
				}).then(res => (
					res.ok ? sendSuccess() : Promise.reject(res)
				)).catch(err => {
					const alertMsg = err.statusText || err;
					this.setState({
						alertMsg,
						buttonLoading: false
					});
				});
			});
		};
		const closeSuccess = () => {
			this.timer && clearTimeout(this.timer);
			this.setState({ isClosed: true });
		}
		const handleClose = e => {
			const action = e.target.textContent;
			Modal.confirm({
				title: i18n.modalConfirmTitle,
				content: this.props.intl.formatMessage({ id: 'modalConfirmBody' }, { action, target: '' }),
				onOk: () => {
					const id = this.props.match.params.id;
					fetch(`/api/chatbot/manual/close/${id}`, {
						method: 'PUT'
					}).then(res => (
						res.ok ? closeSuccess() : Promise.reject(res)
					)).catch(err => {
						let warnMsg = err.statusText || err;
						warnMsg = i18n[warnMsg]
						if (warnMsg) {
							Modal.warning({
								title: i18n.modalWarningTitle,
								content: warnMsg
							});
						} else {
							Modal.error({
								title: i18n.modalErrorTitle,
								content: i18n.msgError
							});
						}
					});
				}
			});
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
