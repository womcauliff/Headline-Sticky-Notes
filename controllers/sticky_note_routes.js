var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');

// Note and Article models
var StickyNote = require('../models/StickyNote.js');
var Article = require('../models/Article.js');

// A GET request to scrape the echojs website.
router.get('/scrape', function(req, res) {

	var sources = [
		{
			siteURL: "http://www.nytimes.com/pages/technology/",
			articleSelector : 'div.ledeStory',
			titleSelector : '.storyHeader > h2 > a',
			sourceSelector : '.storyHeader > h2 > a'
		}
	];
	sources.forEach(scrapeEachSource);

	function scrapeEachSource(source, index, sources) {
		
		request(source.siteURL, function(error, response, html) {
			if (error) {
				console.log(error);
				return;
			}

			var $ = cheerio.load(html);
			$(source.articleSelector).each(function(index, el) {
				var article = {};
				article.title = $(el).find(source.titleSelector).text();
				article.source = $(el).find(source.sourceSelector).attr('href');

				//Saves article entry to db
				var entry = new Article (article);
				entry.save(function(err, doc) {
					if (err)
						console.log(err);
					else
						console.log(doc);
				});
			});

			//Sends articles to client after all sources have been scraped
			if(index == sources.length - 1) {
				Article.find({}, function(err, docs){
					if (err)
						console.log(err);
					else
						res.json(docs);
				});
			}
		});
	}

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

// Retrieves the StickyNotes associated with an article by it's ObjectId
router.get('/articles/:id', function(req, res){
	// using the id passed in the id parameter, 
	// prepare a query that finds the matching one in our db...
	Article.findOne({'_id': req.params.id})
	// and populate all of the notes associated with it.
	.populate('stickyNotes')
	// now, execute our query
	.exec(function(err, doc){
		// log any errors
		if (err){
			console.log(err);
		} 
		// otherwise, send the doc to the browser as a json object
		else {
			res.json(doc);
		}
	});
});

// replace the existing note of an article with a new one
// or if no note exists for an article, make the posted note it's note.
router.post('/articles/:id', function(req, res){
	// create a new note and pass the req.body to the entry.
	console.log(req.body);
	var newNote = new StickyNote(req.body);

	// and save the new note the db
	newNote.save(function(err, doc){
		// log any errors
		if(err){
			console.log(err);
		} 
		// otherwise
		else {
			// using the Article id passed in the id parameter of our url, 
			// prepare a query that finds the matching Article in our db
			// and update it to make it's lone note the one we just saved
			Article.findOneAndUpdate({'_id': req.params.id}, {$push: {'stickyNotes': doc._id}}, {new: true})
			// execute the above query
			.exec(function(err, doc){
				// log any errors
				if (err){
					console.log(err);
				} else {
					// or send the document to the browser
					res.send(doc);
				}
			});
		}
	});
});

module.exports = router;
