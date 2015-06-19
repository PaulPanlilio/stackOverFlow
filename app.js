$(document).ready( function() {
	$('.unanswered-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});

	$('.inspiration-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var answerers = $(this).find("input[name='answerers']").val();
		getInspired(answerers);
	});
});


var showQuestion = function(question) {
	
	var result = $('.templates .question').clone();
	
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' 
				+ question.owner.user_id + ' >' + question.owner.display_name 
				+ '</a>' + '</p>' 
				+ '<p>Reputation: ' + question.owner.reputation + '</p>'
	);
	return result;
};

var showUser = function(u) {

	var result = $('.templates .user').clone();

	var img = result.find('.profile-img');
	img.html("<img src=\"" + u.user.profile_image + "\"/>");

	var name = result.find('.user-name');
	name.html("<a target=\"_blank\" href=\"" + u.user.link + "\"><p>" + u.user.display_name + "</p></a>");

	var repu = result.find('.reputation');
	repu.text(u.user.reputation);

	return result;
};

// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

var getUnanswered = function(tags) {
	
	var request = { tagged: tags,
					  site: 'stackoverflow',
					 order: 'desc',
					  sort: 'creation' };
	
	var result = $.ajax({ url: "http://api.stackexchange.com/2.2/questions/unanswered",
		   				 data: request,
	  				 dataType: "jsonp",
						 type: "GET" })
	.done(function(result){
		console.log(result);
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};


var getInspired = function(tags) {
	
	var request = { tagged: tags,
					site: 'stackoverflow' };
	
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/tags/" + tags + "/top-answerers/all_time",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result){
		console.log(result);
		var searchResults = showSearchResults(request.tagged, result.items.length);
		$('.search-results').html(searchResults);
		$.each(result.items, function(i, item) {
			var user = showUser(item);
			console.log(user);
			$('.results').append(user);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
	
};