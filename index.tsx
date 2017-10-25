import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {store} from './App/State';
import {Provider} from 'react-redux';
import {App} from './App';

ReactDOM.render(<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById("app"));