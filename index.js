let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let uuid = require('uuid');
let mongoose = require('mongoose');
let {CommentList} = require('./model');
let {DATABASE_URL, PORT} = require('./config');

let jsonParser = bodyParser.json();
let app = express();

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
	res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
	if (req.method === "OPTIONS") {
		return res.send(204);
	}
	next();
});

app.use(express.static('public'));
app.use(morgan('dev'));

app.get('/blog-api/comentarios', (req, res) =>{
	CommentList.getAll()
	.then((comments) =>{
		return res.status(200).json(comments);
	})
	.catch((error) =>{
		return res.status(500).send();
	});
});

app.get('/blog-api/comentarios-por-autor', (req, res) =>{
	if(req.query.autor == ""){
		res.statusMessage = "No se recibió el parámetro autor.";
		return res.status(406).send();
	}
	CommentList.getByAuthor(req.query.autor)
	.then((comments)=>{
		if(comments){
			return res.status(200).json(comments);
		}
		res.statusMessage = "No se encontraron comentarios del autor proporcionado."
		return res.status(404).send();
	})
	.catch((error)=>{
		return res.status(500).send();
	});
});

app.post('/blog-api/nuevo-comentario', jsonParser, (req, res) =>{
	if(req.body.titulo == "" || req.body.contenido == "" || req.body.autor == ""){
		res.statusMessage = "Faltan parámetros.";
		return res.status(406).send();
	}
	let newComment = req.body;
	newComment.fecha = new Date();
	newComment.id = uuid.v4();
	CommentList.createComment(newComment);
	return res.status(201).json(newComment);
});

app.put('/blog-api/actualizar-comentario/:id', jsonParser, (req, res) =>{
	if(req.body.id == ""){
		res.statusMessage = "No se proporciona el id del comentario."
		return res.status(406).send();
	}
	if(req.body.id != req.params.id){
		res.statusMessage = "Los id enviados no coinciden."
		return res.status(409).send();
	}
	if(req.body.titulo == "" && req.body.contenido == "" && req.body.autor == ""){
		res.statusMessage = "No hay parámetros para actualizar.";
		return res.status(406).send();
	}
	CommentList.updateComment(req.body.titulo, req.body.contenido, req.body.autor, req.body.id)
	.then((comment) =>{
		return res.status(202).json(result);
	})
	.catch((err) =>{
		return res.status(500).send();
	});
});

app.delete('/blog-api/remover-comentario/:id', jsonParser, (req, res) =>{
	CommentList.deleteComment(req.params.id)
	.then((result) =>{
		return res.status(204).json({});
	})
	.catch((err) =>{
		return res.status(500).send();
	});
});


function runServer(port, databaseUrl){
	return new Promise( (resolve, reject ) => {
		mongoose.connect(databaseUrl, response => {
			if ( response ){
				return reject(response);
			} else{
				server = app.listen(port, () => {
					console.log( "App is running on port " + port );
					resolve();
				})
				.on( 'error', err => {
					mongoose.disconnect();
					return reject(err);
				})
			}
		});
	});
}

function closeServer(){
	return mongoose.disconnect()
		.then(() => {
			return new Promise((resolve, reject) => {
				console.log('Closing the server');
				server.close( err => {
					if (err){
						return reject(err);
					} else {
						resolve();
					}
				});
			});
		});
}

runServer(PORT, DATABASE_URL);

module.exports = {app, runServer, closeServer}