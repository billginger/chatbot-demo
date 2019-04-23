import React from 'react';
import { render } from 'react-dom';

const test = () => {
	if (['a', 'b', 'c'].includes('a')) {
		return 'es7';
	} else {
		return 'es5';
	}
};

const App = () => (
	<div>
		<p>Hello {test()}!</p>
	</div>
);

render(<App />, document.getElementById('root'));
