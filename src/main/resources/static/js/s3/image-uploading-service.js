function ImageUploadingService(opt_options) {
	var options = opt_options || {};  
	if (options['bucketName']) {
		 this.bucketName  = options['bucketName'];
	}else{
		this.bucketName  = "assets.iceexchange.com"
	}
	if (options['folderName']) {
		 this.folderName  = options[''];
	}
	AWS.config.update({
	  region: "ap-south-1",
	  credentials: new AWS.CognitoIdentityCredentials({
		  IdentityPoolId: "ap-south-1:6958ac77-fe01-4c6d-af33-888ab73983fb"
	  })
	});

	this.s3 = new AWS.S3({
		apiVersion: "2014-06-30",
		params: { Bucket: this.bucketName }
	});
	console.log("Image Uploading service init ==>");
}

ImageUploadingService.prototype.uploadImage = function(file,callback,albumName) {
	if (!file) {
		showToastr("Please select a file to upload",true);
		return;
	}
    var fileName = (new Date).getTime()+"_"+file.name;
    var folderName =this.folderName;
    if(albumName){
    	fileName = albumName + fileName;
	}else if(folderName){
    	fileName = this.folderName + fileName;
	}
    console.log(fileName+" uploading.......")
    displayPageLoader();
    var upload = new AWS.S3.ManagedUpload({
        params: {
           Bucket: this.bucketName,
           Key: fileName,
           Body: file,
           ACL: "public-read"
        }
    });
    upload.promise().then(function(response){
    	if(albumName){
    		response.key = response.key.replace(albumName,"") 
    	}else if(folderName){
    		response.key = response.key.replace(folderName,"")
    	}
    	callback(response);
    	showToastr("Successfully uploaded image")
	},function(error){
		removePageLoader();
		showToastr("There was an error uploadinging your image: : "+error,true)
	});
}

ImageUploadingService.prototype.deleteImage = function(fileName,callback,albumName) {
	if(!fileName){
	    showToastr("Please select a file to delete",true);
	    return;
	}
	if(albumName){
	   	fileName = albumName + fileName;
	}else if(this.folderName){
	   	fileName = this.folderName + fileName;
	}
    console.log(fileName+" deleting.......")
    displayPageLoader();
	this.s3.deleteObject({ Key: fileName },function(error, response) {
	    if (error) {
		   removePageLoader();
	       showToastr("There was an error deleting your image: "+error.message,true);
	       return;
	    }
		callback(error, response);
	    showToastr("Successfully Deleted image");
	});
}

ImageUploadingService.prototype.listImage = function(callback, albumName) {
	var prefix="";
	if(albumName){
		prefix = albumName;
	}else if(this.folderName){
		prefix = this.folderName;
	}
    console.log(prefix+" listing.......")
	displayPageLoader();	
	this.s3.listObjects({ Prefix: prefix },function(error, response) {
		removePageLoader();
		if (error) {
			showToastr("There was an error viewing your images: " + error.message,true);
			return;
		}
		callback(error, response);
	});
}

ImageUploadingService.prototype.compressImage = function(file,opt_options) {
	if(!file){
		showToastr("Please select a file to compress",true);
		return;
	}
	var options = opt_options || {};  
	if (!options['maxWidth']) {
		options['maxWidth']  = 1200
	}
	if (!options['maxHeight']) {
		options['maxHeight']  = 1200
	}
	if (!options['quality']) {
		options['quality']  = 0.6
	}
	if (!options['success']) {
		options['success']  = function(success) {
			console.log(success);
		}
	}
	if (!options['error']) {
		options['error']  = function(error) {
			console.log(error);
		}
	}
	new Compressor(file,options);
}

ImageUploadingService.prototype.blobToFile= function(theBlob, fileName){
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}
