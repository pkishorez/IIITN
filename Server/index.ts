import * as express from 'express';
import * as path from 'path';
import * as http from 'http';
import * as socketIO from 'socket.io';
import {Connection} from './Connection';

let app = express();
let httpServer = new http.Server(app);
let io = socketIO(httpServer);

app.use(express.static("./"));

app.get('*', (req, res)=>{
	res.sendFile(path.resolve('./index.html'));
});


let server = httpServer.listen(8081, ()=>{
	let host = server.address().address;
	let port = server.address().port;
	console.log(`Server started : ${host} : ${port}`);
});

io.on('connection', (socket)=>{
	// NEW CONNECTION.
	console.log("Connection...");
	new Connection(socket);
});