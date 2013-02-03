var fs = require('fs'),
_ = require('underscore'),
rootPath = "/Users/vaibhav/Documents/myStuff/experiments/http-proxy",
regex = /\[(\d{2}\/\w{3}\/\d{4}):(\d{2}:\d{2}:\d{2}).*\]/g,
dateTimeJson = [],
totalFiles = 0,
filesProcessed = 0;

fs.readdir(rootPath, function(err, files){
	_.each(files, function(fileName, index){
		if(fileName.indexOf("access_log") == 0){
			totalFiles++;
			readLogFile(fileName, concatData);
		}
	});
});

function readLogFile(filePath, callback){
	fs.readFile(rootPath + "/" + filePath, "utf8",function(err, data){
		var dateTimeArray = getDateTimeObject(data);	
		callback(dateTimeArray);
	});
}

function getDateTimeObject(fileContents){
	var dateTimeObject = [],
	matches = [];
	while(matches = regex.exec(fileContents)){
		dateTimeObject.push(
			{
				"date":matches[1],
				"time":matches[2]
			}
		);
	}
	return dateTimeObject;
}

function concatData(data){
	dateTimeJson = dateTimeJson.concat(data);
	filesProcessed++;
	if(filesProcessed == totalFiles){
		writeToFile();
	}
}

function writeToFile (){
	fs.writeFile("output.json",JSON.stringify(dateTimeJson), function(err)
						{
							if(err)
								console.log(err);
							else
								console.log("DONE");

						}
					);
}
