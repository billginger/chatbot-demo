import { combineReducers, createStore } from 'redux';
import { lang } from '../i18n';

// Action
const setLanguage = payload => (
	{ type: 'SET_LANGUAGE', payload }
);

// Reducer
const language = (state = lang, action) => (
	action.type == 'SET_LANGUAGE' ? action.payload : state
);
const reducer = combineReducers({
	language
});

// Store
const store = createStore(reducer);

export { setLanguage, store };
