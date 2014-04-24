function Droppable(){
	this.dropzone;
	this.progressBar;
	this.totalWidth;
	this.inputName;
	this.dbInputName;
	this.url;
	this.deleteurl;
	this.inputTrigger;
	this.toTrigger;
	this.success = false;
	this.uploaded = {};
}

Droppable.prototype.config = function(data){
	this.dropzone = document.getElementById(data.dropzone);
	if(data.statusbar == ""){
		this.progressBar = document.getElementById(data.statusbar);
		this.totalWidth = this.progressBar.parentNode.offsetWidth;
	}	
	this.inputName = data.filename;
	this.dbInputName = data.inputname;
	this.url = data.uploadurl;
	this.deleteurl = data.deleteurl;
	this.inputTrigger = data.textinput;
	//load uploaded
	this.uploaded = data.uploaded;
	//cal init functions
	this.preventZone();
	this.appendInput();
	this.handleInput();
}

Droppable.prototype.appendInput = function(){
	var input = document.createElement("input");
	input.setAttribute("type", "file");
	input.setAttribute("name", this.inputName);
	input.style.display = "none";
	this.toTrigger = this.progressBar.parentNode.appendChild(input);
}

Droppable.prototype.handleInput = function(){
	document.getElementById(this.inputTrigger).addEventListener("click", function(){
		droppable.toTrigger.click();
	});
	this.toTrigger.addEventListener("change", function(){
		droppable.processFiles(this.files);
	});
}

Droppable.prototype.handleDelete = function(filePath){
	xhr = new XMLHttpRequest;
	var path = new FormData();
	path.append("path", filePath);
	xhr.upload.addEventListener("progress", function(e){
		droppable.setProgress(e.loaded, e.total);
	});
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status == 200){
			droppable.removePreview(filePath);
			console.log(xhr.responseText);
		}else{
		}
	}
	xhr.open("POST", this.deleteurl);
	xhr.send(path);

}

Droppable.prototype.preventZone = function(){
	this.dropzone.addEventListener("dragenter", function(e){
		e.stopPropagation();
		e.preventDefault();
	});
	this.dropzone.addEventListener("dragover", function(e){
		e.stopPropagation();
		e.preventDefault();
	});
	this.dropzone.addEventListener("drop", function(e){
		e.stopPropagation();
		e.preventDefault();
		droppable.processFiles(e.dataTransfer.files);
	});
}

Droppable.prototype.setProgress = function(loaded, total){
	var percent = Math.ceil((loaded / total) * 100);
	this.progressBar.style.width = ((percent / 100) * this.totalWidth);
	if(percent == 100){
		setTimeout(function(){droppable.progressBar.style.width = 0;}, 500);
		this.success = true;	
	}else{

	}
}

Droppable.prototype.processFiles = function(filesDropped){
	for(var i=0;i<filesDropped.length;i++){
		this.uploadFile(filesDropped[i]);
	}
}

Droppable.prototype.uploadFile = function(file){
	data = new FormData();
	data.append(this.inputName, file);
	var xhr = new XMLHttpRequest();
	xhr.upload.addEventListener("progress", function(e){
		if(droppable.statusbar == ""){}
		else{
			droppable.setProgress(e.loaded, e.total);
		}
	});
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status == 200){
			//success
			droppable.appendUploaded(JSON.parse(xhr.responseText));
			console.log(xhr.responseText);
		}else{
			//error occured
		}
	}
	xhr.open("POST", this .url);
	xhr.send(data);
}

Droppable.prototype.appendUploaded = function(data){
	//basic div
	var append = document.createElement("div");
	append.setAttribute("class","droppable_preview");
	append.setAttribute("id", data.name);
	var preview = document.getElementById("previews").appendChild(append);
	//img container
	var append_wrap = document.createElement("div");
	append_wrap.setAttribute("class", "img_wrap");
	preview.appendChild(append_wrap);
	//img
	append = document.createElement("img");
	append.src = data.path;
	append.alt = data.name;
	append_wrap.appendChild(append);
	//title
	append = document.createElement("p");
	var text = document.createTextNode(data.name);
	append.appendChild(text);
	preview.appendChild(append);
	//inputs to send
	append = document.createElement("input");
	append.setAttribute("id", "droppable_input_"+data.name);
	append.setAttribute("type", "hidden");
	append.setAttribute("value", data.path);
	append.setAttribute("name", this.dbInputName);
	document.getElementById("droppable_inputs").appendChild(append);
	//delete link
	append = document.createElement("a");
	text = document.createTextNode("Zmazať");
	append.setAttribute("href", "");
	append.setAttribute("data-name", data.name);
	append.setAttribute("class", "droppable_delete");
	append.onclick = function(e){
		e.preventDefault();
		droppable.handleDelete(this.getAttribute("data-name"));
	}
	append.appendChild(text);
	preview.appendChild(append);
}

Droppable.prototype.removePreview = function(id){
	this.removeDbInput(id);
	var element = document.getElementById(id);
	element.remove();
}

Droppable.prototype.removeDbInput = function(id){
	var element = document.getElementById("droppable_input_"+id);
	element.remove();	
}

Droppable.prototype.load = function(data){
	for(i=0;i<data.length;i++){
		this.appendUploaded(data[i]);
	}
}

droppable = new Droppable();