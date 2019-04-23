import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './redux';

const App = () => (
	<Provider store={store}>
		<p>Weclome to Gravity Portal!</p>
	</Provider>
);

render(<App />, document.getElementById('root'));
