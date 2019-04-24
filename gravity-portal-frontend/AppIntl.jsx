import React from 'react';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { i18n } from './i18n';
import AppRouter from './AppRouter.jsx';

const AppIntl = ({ intl }) => (
	<IntlProvider locale={intl.locale} messages={intl.messages}>
		<AppRouter />
	</IntlProvider>
);

const mapStateToProps = state => ({
	intl: i18n[state.language]
});

export default connect(mapStateToProps)(AppIntl);
