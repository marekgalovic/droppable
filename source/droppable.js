function Droppable(){
	this.dropzone;
	this.progressBar;
	this.totalWidth;
	this.inputName;
	this.dbInputName;
	this.url;
	this.inputTrigger;
	this.toTrigger;
	this.success = false;
}

Droppable.prototype.config = function(data){
	this.dropzone = document.getElementById(data.dropzone);
	this.progressBar = document.getElementById(data.statusbar);
	this.totalWidth = this.progressBar.parentNode.offsetWidth;
	this.inputName = data.filename;
	this.dbInputName = data.inputname;
	this.url = data.url;
	this.inputTrigger = data.textinput;
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
	console.log(percent);
	if(percent == 100){
		setTimeout(function(){droppable.progressBar.style.width = 0;}, 1000);
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
		droppable.setProgress(e.loaded, e.total);
	});
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			//success
			droppable.appendUploaded(JSON.parse(xhr.responseText));
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
	append.setAttribute("type", "hidden");
	append.setAttribute("value", data.path);
	append.setAttribute("name", this.dbInputName);
	document.getElementById("droppable_inputs").appendChild(append); 
}

droppable = new Droppable();