let mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let commentCollection = mongoose.Schema({
	id : {
		type : String,
		required : true,
		unique : true
	},
	titulo : {
		type : String,
		required : true
	},
	contenido : {
		type: String,
		required : true
	},
	autor : {type : String,
		required : true
	},
	fecha : {type : String,
		required : true
	}
});

let Comment = mongoose.model('comments', commentCollection);

let CommentList = {
	getAll : function(){
		return Comment.find()
			.then(comments =>{
				return comments;
			})
			.catch(error =>{
				throw Error(error);
			});
	},
	getByAuthor : function(author){
		return Comment.find({autor: author})
			.then(comments =>{
				return comments;
			})
			.catch(error =>{
				throw Error(error);
			});
	},
	updateComment : function(titulo, contenido, autor, id){
		let idToUpdate = {
			id
		}
		let updatedComment = {
			id
		}
		if(titulo){
			updatedComment.titulo = titulo;
		}
		if(autor){
			updatedComment.autor = autor;
		}
		if(contenido){
			updatedComment.contenido = contenido;
		}
		return Comment.update(idToUpdate, updatedComment)
			.then(comments =>{
				return comments;
			})
			.catch(error =>{
				throw Error(error);
			});
	},
	createComment : function(newComment){
		return Comment.create(newComment)
			.then(comments =>{
				return newComment;
			})
			.catch(error =>{
				throw Error(error);
			});
	},
	deleteComment : function(id){
		let idToRemove = {
			id
		}
		return Comment.remove(idToRemove)
			.then(result =>{
				return result;
			})
			.catch(error =>{
				throw Error(error);
			});
	}
}

module.exports = {
	CommentList
};