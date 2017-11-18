import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {__store} from './App/State';
import {Provider} from 'react-redux';
import {App} from './App';

ReactDOM.render(<Provider store={__store}>
		<App />
	</Provider>,
	document.getElementById("app"));