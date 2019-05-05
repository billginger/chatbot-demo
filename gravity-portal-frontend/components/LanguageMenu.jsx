import React from 'react';
import { connect } from 'react-redux';
import { Menu, Icon } from 'antd';
import { setLanguage } from '../redux';
import { i18n } from '../i18n';
import { setStorage } from '../utils/browser.js';

let menuItem = [];
for (let key in i18n) {
	menuItem.push(<Menu.Item key={key}>{i18n[key].name}</Menu.Item>);
}

const LanguageMenu = ({ id, theme, lang, setLang }) => {
	const changeLanguage = e => {
		setStorage('userLanguage', e.key);
		setLang(e.key);
	};
	return (
		<Menu
			id={id}
			theme={theme}
			mode="horizontal"
			subMenuCloseDelay={0}
			selectedKeys={[lang]}
			onClick={changeLanguage}
		>
			<Menu.SubMenu title={<Icon type="global" />}>
				{menuItem}
			</Menu.SubMenu>
		</Menu>
	);
};

const mapStateToProps = state => ({
	lang: state.language
});

const mapDispatchToProps = dispatch => ({
	setLang: payload => dispatch(setLanguage(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(LanguageMenu);
