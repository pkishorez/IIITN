import * as express from 'express';
import * as path from 'path';

let app = express();

app.use(express.static("./"));

app.use('*', (req, res)=>{
	res.sendFile(path.join(__dirname, '../index.html'));
});


let server = app.listen(8081, ()=>{
	let host = server.address().address;
	let port = server.address().port;
	console.log(`Server started : ${host} : ${port}`);
});