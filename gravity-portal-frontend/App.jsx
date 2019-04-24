import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './redux';
import AppIntl from './AppIntl.jsx';

const App = () => (
	<Provider store={store}>
		<AppIntl />
	</Provider>
);

render(<App />, document.getElementById('root'));
