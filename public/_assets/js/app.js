$('#scrape-button').on('click', function(event) {
	console.log("clicked");
	event.preventDefault();
	/* Act on the event */
	$.get('/scrape', function(data) {
		console.log(data);
		$.each(data, function(index, val) {
			$articleDiv = $('<div></div>').addClass('article');
			$articleContent = $('<h2>').append(
				$('<a>').attr('href', val.source).text(val.title)
			);
			$articleDiv.append(
				$articleContent
			);
			$('.articles').append($articleDiv);
		});
	});
});