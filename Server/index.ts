import * as express from 'express';
import * as path from 'path';
import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';
import * as socketIO from 'socket.io';
import {Connection} from './Connection';

let app = express();

// sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/apache-selfsigned.key -out /etc/ssl/certs/apache-selfsigned.crt
let privateKey = fs.readFileSync('./assets/certs/iiitnselfsigned.key', 'utf8');
let certificate = fs.readFileSync('./assets/certs/iiitnselfsigned.crt', 'utf8');

//let httpServer = new http.Server(app);
let httpsServer = https.createServer({
	key: privateKey,
	cert: certificate
}, app);
let io = socketIO(httpsServer);

/*
app.get("/bundle/bundle.js", (req, res, next)=>{
	req.url = req.url + '.gz';
	console.log("Requested GZ");
	res.set('Content-Encoding', 'gzip');
	next();
});
*/

app.use(express.static("./"));

app.get('*', (req, res)=>{
	res.sendFile(path.resolve('./index.html'));
});


let server = httpsServer.listen(443, ()=>{
	let host = server.address().address;
	let port = server.address().port;
	console.log(`Server started : ${host} : ${port}`);
});

io.on('connection', (socket)=>{
	// NEW CONNECTION.
	console.log("Connection...");
	new Connection(socket);
});