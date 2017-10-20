
export let ServiceWorker = {
	initialize()
	{
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker.register("/SW.js").then((reg)=>{
				console.log("Service Worker successfully registered.");
			}).catch((err)=>{
				console.error("Servicer Worker Registration failed.", err);
			});
		}
		else {
			console.error("ServiceWorker is not supported in your browser :(");
		}
	}
};