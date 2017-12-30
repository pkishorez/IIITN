import {Network} from 'App/Network/';
import { __store } from 'App/State';
import { IRequestType } from 'Server/Connection';
import { Feedback } from 'classui/Components/Feedback';

export let Helper = {
	requestAndDispatch(req_type: IRequestType, data?: any, showError=true) {
		return Network.request(req_type, data).then((response: any)=>{
			if (typeof response == "object") {
				__store.dispatch({
					type: req_type,
					...data,
					...response
				});
			}
			else {
				__store.dispatch({
					type: req_type,
					...data
				});
			}
			return response;
		}).catch((error)=>{
			if (showError)
				Feedback.show(error, "error");
			return Promise.reject(error);
		})
	}
}