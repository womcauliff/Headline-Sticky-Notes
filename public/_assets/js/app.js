$('#scrape-button').on('click', function(event) {
	console.log("clicked");
	event.preventDefault();
	/* Act on the event */
	$.get('/scrape', function(data) {
		console.log(data);
		$.each(data, function(index, val) {
			$articleDiv = $('<div></div>').addClass('article');
			$title = $('<h2>').text(val.title);
			$sticky = $('<button>View Sticky Notes <i class="fa fa-sticky-note-o" aria-hidden="true"></i></button>')
				.addClass("btn btn-sticky btn-block")
				.attr('data-articleID', val._id);
			$externalLink = $('<a>Read Article <i class="fa fa-external-link" aria-hidden="true"></i></a>')
				.addClass("btn btn-info btn-block")
				.attr('href', val.source)
				.attr('target', '_blank');

			$articleDiv
				.append($title)
				.append($sticky)
				.append($externalLink);
			$('.articles').append($articleDiv);
		});
	});
});

$(document).on('click', '.btn-sticky', function(event) {
	console.log('clicked');
	$('#sticky-notes').empty();
	// save the id from the p tag
	var thisId = $(this).attr('data-articleID');
	console.log(thisId);

	// now make an ajax call for the Article
	$.ajax({
	method: "GET",
	url: "/articles/" + thisId,
	})
	// with that done, add the note information to the page
	.done(function( data ) {
		console.log(data);
		// if there's a note in the article
		if(data.stickyNotes){
			console.log('contains notes');
			data.stickyNotes.forEach(function(note) {
				$n = $("<p>").addClass('sticky-note').text(note.body);
				$("#sticky-notes").append($n);
			});
		}

		// a textarea to add a new note body
		$('#sticky-notes').append('<textarea id="bodyinput" name="body"></textarea>'); 
		// a button to submit a new note, with the id of the article saved to it
		$('#sticky-notes').append('<button data-articleID="' + data._id + '" id="savenote">Save Sticky Note</button>');
	});
});

// when you click the savenote button
$(document).on('click', '#savenote', function(){
	// grab the id associated with the article from the submit button
	var thisId = $(this).attr('data-articleID');
	console.log(thisId);

	// run a POST request to change the note, using what's entered in the inputs
	$.ajax({
		method: "POST",
		url: "/articles/" + thisId,
		data: {
		  body: $('#bodyinput').val() // value taken from note textarea
		}
	})
	// with that done
	.done(function( data ) {
		// log the response
		console.log(data);

		$('#sticky-notes').empty();

		// now make an ajax call for the Article
		$.ajax({
		method: "GET",
		url: "/articles/" + thisId,
		})
		// with that done, add the note information to the page
		.done(function( data ) {
			console.log(data);
			// if there's a note in the article
			if(data.stickyNotes){
				console.log('contains notes');
				data.stickyNotes.forEach(function(note) {
					$n = $("<p>").addClass('sticky-note').text(note.body);
					$("#sticky-notes").append($n);
				});
			}

			// a textarea to add a new note body
			$('#sticky-notes').append('<textarea id="bodyinput" name="body"></textarea>'); 
			// a button to submit a new note, with the id of the article saved to it
			$('#sticky-notes').append('<button data-articleID="' + data._id + '" id="savenote">Save Sticky Note</button>');
		});
	});

	


});