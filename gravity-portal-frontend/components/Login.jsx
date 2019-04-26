import React from 'react';
import { injectIntl } from 'react-intl';
import { Card, Form, Input, Icon, Checkbox, Button, Alert } from 'antd';
import LanguageMenu from './LanguageMenu.jsx';

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			errMsg: '',
			buttonLoading: false
		}
	}
	render() {
		const i18n = this.props.intl.messages;
		const { getFieldDecorator, validateFieldsAndScroll } = this.props.form;
		const { errMsg, buttonLoading } = this.state;
		const alertMessage = errMsg && (i18n[errMsg] || i18n.msgError);
		const handleSubmit = e => {
			e.preventDefault();
			validateFieldsAndScroll((err, values) => {
				if (err) return;
				this.setState({
					buttonLoading: true
				});
				fetch('/api/user/login', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(values)
				}).then(res => (
					res.ok ? this.props.history.push('/') : Promise.reject(res)
				)).catch(err => {
					const errMsg = err.statusText || err;
					this.setState({
						errMsg,
						buttonLoading: false
					});
				});
			});
		};
		const handleInputChange = () => {
			this.setState({
				errMsg: ''
			});
		};
		const formAlert = (
			alertMessage && <Alert className="tc-login-alert" message={alertMessage} type="error" />
		);
		return (
			<div id="tc-login">
				<LanguageMenu id="tc-login-language" />
				<Card id="tc-login-card" title={i18n.loginTitle}>
					<Form onSubmit={handleSubmit}>
						<Form.Item>
							{getFieldDecorator('un', {
								rules: [{ required: true, message: i18n.msgNeedInput }]
							})(
								<Input
									prefix={<Icon type="user" className="tc-login-icon" />}
									placeholder={i18n.loginUsername}
									onChange={handleInputChange}
								/>
							)}
						</Form.Item>
						<Form.Item>
							{getFieldDecorator('pw', {
								rules: [{ required: true, message: i18n.msgNeedInput }]
							})(
								<Input
									prefix={<Icon type="lock" className="tc-login-icon" />}
									placeholder={i18n.loginPassword}
									type="password"
									onChange={handleInputChange}
								/>
							)}
						</Form.Item>
						<Form.Item>
							{getFieldDecorator('rm', {
								valuePropName: 'checked'
							})(
								<Checkbox onChange={handleInputChange}>{i18n.loginRememberMe}</Checkbox>
							)}
							<a id="tc-login-forgot">{i18n.loginForgotPassword}</a>
							{formAlert}
							<Button type="primary" htmlType="submit" block loading={buttonLoading}>
								{i18n.loginButton}
							</Button>
						</Form.Item>
					</Form>
				</Card>
			</div>
		);
	}
}

export default injectIntl(Form.create()(Login));
