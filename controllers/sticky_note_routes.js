var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');

// Note and Article models
// var Note = require('./models/Note.js');
// var Article = require('./models/Article.js');

// A GET request to scrape the echojs website.
router.get('/scrape', function(req, res) {

	var sources = [
		"http://www.nytimes.com/pages/technology/"
	];
	sources.forEach(scrapeEachSource);

	var articles = [];
	function scrapeEachSource(source, index, sources) {
			console.log(sources.length);
		
		request(source, function(error, response, html) {
			if (error) res.send(error);
			
			var $ = cheerio.load(html);
			$('div.ledeStory').each(function(index, el) {
				console.log($(el).find('.storyHeader > h2 > a').text());
				console.log('h2 a href' + $(this).find('.storyHeader > h2 > a').attr('href'));

				var article = {};
				article.title = $(el).find('.storyHeader > h2 > a').text();
				article.source = $(el).find('.storyHeader > h2 > a').attr('href');
				articles.push(article);
			});
			console.log('done with ' + source);
			console.log("index: " + index);
			//send articles to client
			if(index == sources.length - 1) {
				console.log('sending');
				res.send(articles);
			}
		});

	}

	// // first, we grab the body of the html with request
 //  request('http://www.nytimes.com/pages/technology/', function(error, response, html) {
 //  	// then, we load that into cheerio and save it to $ for a shorthand selector
 //    var $ = cheerio.load(html);
 //    // now, we grab every h2 within an article tag, and do the following:
 //    $('article h2').each(function(i, element) {

 //    		// save an empty result object
	// 			var result = {};

	// 			// add the text and href of every link, 
	// 			// and save them as properties of the result obj
	// 			result.title = $(this).children('a').text();
	// 			result.link = $(this).children('a').attr('href');

	// 			// using our Article model, create a new entry.
	// 			// Notice the (result):
	// 			// This effectively passes the result object to the entry (and the title and link)
	// 			var entry = new Article (result);

	// 			// now, save that entry to the db
	// 			entry.save(function(err, doc) {
	// 				// log any errors
	// 			  if (err) {
	// 			    console.log(err);
	// 			  } 
	// 			  // or log the doc
	// 			  else {
	// 			    console.log(doc);
	// 			  }
	// 			});


 //    });
 //  });
 //  // tell the browser that we finished scraping the text.
 //  res.send("Scrape Complete");
});

// // this will get the articles we scraped from the mongoDB
// router.get('/articles', function(req, res){
// 	// grab every doc in the Articles array
// 	Article.find({}, function(err, doc){
// 		// log any errors
// 		if (err){
// 			console.log(err);
// 		} 
// 		// or send the doc to the browser as a json object
// 		else {
// 			res.json(doc);
// 		}
// 	});
// });

// // grab an article by it's ObjectId
// router.get('/articles/:id', function(req, res){
// 	// using the id passed in the id parameter, 
// 	// prepare a query that finds the matching one in our db...
// 	Article.findOne({'_id': req.params.id})
// 	// and populate all of the notes associated with it.
// 	.populate('note')
// 	// now, execute our query
// 	.exec(function(err, doc){
// 		// log any errors
// 		if (err){
// 			console.log(err);
// 		} 
// 		// otherwise, send the doc to the browser as a json object
// 		else {
// 			res.json(doc);
// 		}
// 	});
// });

// // replace the existing note of an article with a new one
// // or if no note exists for an article, make the posted note it's note.
// router.post('/articles/:id', function(req, res){
// 	// create a new note and pass the req.body to the entry.
// 	var newNote = new Note(req.body);

// 	// and save the new note the db
// 	newNote.save(function(err, doc){
// 		// log any errors
// 		if(err){
// 			console.log(err);
// 		} 
// 		// otherwise
// 		else {
// 			// using the Article id passed in the id parameter of our url, 
// 			// prepare a query that finds the matching Article in our db
// 			// and update it to make it's lone note the one we just saved
// 			Article.findOneAndUpdate({'_id': req.params.id}, {'note':doc._id})
// 			// execute the above query
// 			.exec(function(err, doc){
// 				// log any errors
// 				if (err){
// 					console.log(err);
// 				} else {
// 					// or send the document to the browser
// 					res.send(doc);
// 				}
// 			});
// 		}
// 	});
// });

module.exports = router;
