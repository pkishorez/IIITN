let CACHE_NAME = "iiitncache";

let urlsToCache: string[] = [
	"/"
];

// Install Event.
self.addEventListener("install", (event:any)=>{
	// Perform install steps.
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache)=>{
			return cache.addAll(urlsToCache);
		})
	);
});

// Activation Event.
self.addEventListener("activate", (event)=>{

});

// Cache fetch requests.
self.addEventListener("fetch", (event: any)=>{
	let url: any = new URL(event.request.url);
	if (url.pathname.startsWith("/assets/") || url.pathname.startsWith("/bundle/")) {
		event.respondWith(
			caches.match(event.request).then((response)=>{
				if (response) {
					return response;
				}
				return fetch(event.request.clone()).then((response)=>{
					let cacheresponse = response.clone();
					caches.open(CACHE_NAME).then((cache)=>{
						cache.put(event.request, cacheresponse);
					});
					return response;
				}).catch(()=>{}) // Ignore fetch error.
			})
		);
		return;
	}
	else {
		event.respondWith(
			caches.match(event.request).then((response)=>{
				if (response) {
					return response;
				}
				return fetch(event.request).catch(()=>{}) // Ignore fetch error.
			})
		);
	}

});