let CACHE_NAME = "iiitncache";

let urlsToCache: string[] = [
	// Cache web pages.
	"/",
	"/playground",
	"/typescript",
	"/login",
	"/2dplayground",

	// Cache webpage resources.
	"/assets/vs/loader.js",
	"/assets/Inconsolata.css",
	"/assets/Draft.css",
	"/assets/canvas2d/global.js",
	
	"/bundle/classui.css",
	"/bundle/bundle.js"
];

// Install Event.
self.addEventListener("install", (event:any)=>{
	if (caches.has(CACHE_NAME)){
		console.log("Deleted old cache...");
		caches.delete(CACHE_NAME);		
	}
	// Perform install steps.
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache)=>{
			return cache.addAll(urlsToCache);
		})
	);
	console.log("New Cache : "+CACHE_NAME);
	(self as any).skipWaiting();
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
				let fetchRequest = fetch(event.request.clone()).then((response)=>{
					let cacheresponse = response.clone();
					caches.open(CACHE_NAME).then((cache)=>{
						cache.put(event.request, cacheresponse);
					});
					return response;
				}).catch(()=>{}) // Ignore fetch error.
				if (response) {
					return response;
				}
				return fetchRequest;
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