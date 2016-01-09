var fs = require('fs'), request = require('request'), cheerio = require('cheerio'),
	url = 'http://unicode.org/emoji/charts/full-emoji-list.html'

var data = [], header = []

var path = 'emojiimg/'

request(url, function(err, response, body){
	if (!err & response.statusCode == 200){
		var $ = cheerio.load(body);
		var $headers = $($('tr')[0]).find('th')
		var $rows = $('tr')
		// create an array with the headers
		$headers.each(function(index, name){
          var check = cleanobj($(name).text());
          header.push(check)
        });
        // rename the first key to remove special characters
		header[0] = 'no'
		// go through each row and parse the details
		$rows.each(function(index, row){
		  var $cells = $(row).find('td');
		  var object = {};
		  var i = 0;
		  // parse cells
	      $cells.each(function(index,cell){
	      	if (object[header[i]]!=header[i]){
	      		if (header[i] == 'name'){
	      			object[header[i]] = titlecase($(cell).text());
	      		} else if (header[i] == 'no'||header[i] == 'code' || header[i] == 'year' || header[i] == 'default' || header[i] == 'annotations' || header[i] == 'brow'){
	      			object[header[i]] = $(cell).text()
	      		} else {
	      			var txt = $($(cell).find('img')).attr('src')
	      			if (txt){
	      				object[header[i]] = saveemoji(txt,object.no,header[i])
	      			}
	      		}
		      	i++;
	      }
        })
	      if (object.no){
	      	 data.push(object);
	      }
	  })
		fs.writeFileSync('data.json',JSON.stringify(data))
	} else {
		console.log('error')
	}
})

// function to clean headers - make lower case and remove punctuation
function cleanobj(e){
    return e.toLowerCase().replace(/ /g,'-').replace(/\./,'');
}

// function to turn a string to titlecase
function titlecase(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

// function to download an image for the emoji type in a folder. Returns the file name of the saved location
function saveemoji(txt,no,type){

	var base64Data = txt.replace(/^data:image\/png;base64,/, "");
	var	binaryData = new Buffer(base64Data, 'base64');

	fs.writeFileSync(path+type+no+".png", binaryData, 'base64', function(err) {
	 	 console.log(err);
	});
	return (path+type+no+".png")
}
