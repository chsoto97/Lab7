function loadComments(){
	let url = '/blog-api/comentarios';
	let settings = {
		method : "GET"
	}
	fetch(url, settings)
		.then(response => {
			if(response.ok){
				return response.json();
			}
		})
		.then(responseJSON => {
			displayResults(responseJSON);
		});
}

function displayResults(responseJSON){
	let editForm = document.getElementById('editComment');
	editForm.style.display = "none";
	let commentSection = document.getElementById('commentSection');
	commentSection.innerHTML = "";
	for(let i=0; i<responseJSON.length; i++){
		divComment = document.createElement("div");
		titulo = document.createElement("h4");
		titulo.innerHTML = responseJSON[i].titulo;
		autor = document.createElement("h5");
		autor.innerHTML = responseJSON[i].autor;
		contenido = document.createElement("p");
		contenido.innerHTML = responseJSON[i].contenido;
		commentId = document.createElement('label');
		commentId.value = responseJSON[i].id;
		commentId.style.display = "none";
		fecha = document.createElement('h6');
		fecha.innerHTML = responseJSON[i].fecha;
		deleteBtn = document.createElement("button");
		deleteBtn.innerHTML = "Delete";
		deleteBtn.name = responseJSON[i].id;
		editBtn = document.createElement("button");
		editBtn.innerHTML = "Edit";
		editBtn.name = responseJSON[i].id;
		commentSection.appendChild(divComment);
		divComment.appendChild(titulo);
		divComment.appendChild(autor);
		divComment.appendChild(contenido);
		divComment.appendChild(fecha);
		divComment.appendChild(commentId);
		divComment.appendChild(editBtn);
		divComment.appendChild(deleteBtn);
	}
}

function watchButtons(){
	let newCmmt = document.getElementById('submitComment');
		newCmmt.addEventListener('click', (event) =>{
			event.preventDefault();
			let titulo = document.getElementById('title').value;
			let autor = document.getElementById('author').value;
			let contenido = document.getElementById('content').value;
			if(titulo!=""&&autor!=""&&contenido!=""){
				let url = "/blog-api/nuevo-comentario";
				let bodyJSON = {
					"titulo" : titulo,
					"autor" : autor,
					"contenido" : contenido
				}
				let settings = {
					method : "POST",
					body : JSON.stringify(bodyJSON),
					headers:{
    					'Content-Type': 'application/json'
  					}
				}
				fetch(url, settings)
					.then((response)=>{
						if(response.ok){
							return response.json();
					}

					throw new Error(response.statusText);
				})
				.then((responseJSON)=>{
					loadComments();
				});
			}
			document.getElementById('newComment').reset();
		});
		let commentSection = document.getElementById('commentSection');
		commentSection.addEventListener('click', (event) =>{
			if(event.target.tagName=="BUTTON"&&event.target.innerHTML=="Delete"){
				let url = "/blog-api/remover-comentario/"+event.target.name;
				let settings = {
					method : "DELETE",
				}
				fetch(url, settings)
					.then((response)=>{
						if(response.ok){
							loadComments();
						} else {
							throw new Error(response.statusText);
						}
				});
			} else if (event.target.tagName=="BUTTON"&&event.target.innerHTML=="Edit") {
				let editForm = document.getElementById('editComment');
				editForm.style.display = "block";
				let titulo = document.getElementById('edittitle');
				titulo.value = event.target.parentElement.children[0].innerHTML;
				let autor = document.getElementById('editauthor');
				autor.value = event.target.parentElement.children[1].innerHTML;
				let content = document.getElementById('editcontent');
				content.value = event.target.parentElement.children[2].innerHTML;
				let id = document.getElementById('editCommentId');
				id.innerHTML = event.target.parentElement.children[4].value;
			}
		});
		let editForm = document.getElementById('editComment');
		editForm.addEventListener('submit', (event) =>{
			let url = "/blog-api/actualizar-comentario/"+document.getElementById('editCommentId').innerHTML;
			let bodyJSON = {
				"titulo" : document.getElementById('edittitle').value,
				"autor" : document.getElementById('editauthor').value,
				"contenido" : document.getElementById('editcontent').value,
				"id" : document.getElementById('editCommentId').innerHTML
			}
			let settings = {
				method : "PUT",
				body : JSON.stringify(bodyJSON),
				headers:{
    				'Content-Type': 'application/json'
  				}
			}
			fetch(url, settings)
				.then((response)=>{
					if(response.ok){
						return response.json();
				}
					throw new Error(response.statusText);
				})
				.then((responseJSON)=>{
					loadComments();
				});
		});
		let search = document.getElementById('busca');
		busca.addEventListener('submit', (event) =>{
			event.preventDefault();
			if(document.getElementById('autorBusq').value!=""){
				let url = '/blog-api/comentarios-por-autor?autor='+document.getElementById('autorBusq').value;
				let settings = {
					method : "GET"
				}
				fetch(url, settings)
					.then(response => {
						if(response.ok){
							return response.json();
						}
					})
					.then(responseJSON => {
						displayResults(responseJSON);
					});
			}
		});
}

function init(){
	loadComments();
	watchButtons();
}

init();