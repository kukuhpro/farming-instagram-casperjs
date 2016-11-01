// Send data to specific URL.
var sendData = function(casper) {
	var base_url = 'http://localhost/kukuh/kumbaya-aggregator/receive/instagram';

	var to = function(data) {
		// Handle Logic to send data via URL.
		var media = data.entry_data.PostPage[0].media;
		// require('utils').dump(media);
		if (media !== undefined) {
			var send_data = {
				id: media.id,
				code: media.code,
				caption: media.caption,
				picture_url: media.display_src,
				owner_username: media.owner.username,
				owner_id: media.owner.id,
				owner_fullname: media.owner.full_name,
				owner_profile_pic: media.owner.profile_pic_url,
				timestamp_date: media.date
			};
			require('utils').dump(send_data);
			// process.exit(1);
			casper.open(base_url, {
				method: 'post',
				data: send_data
			});
			casper.then(function() {
				this.echo('Success Post!');
			});
		}
	};

	return {
		to: to
	};
};

var casper = require('casper').create();
var send = sendData(casper);
var hashtag = 'travel';
var listHrefLinks;

// Starting open instagram URL
casper.start('https://www.instagram.com/explore/tags/' + hashtag + '/');

// Get all link href for insta photos & Post.
// and added base instagram.com as base url
casper.then(function() {
	listHrefLinks = this.getElementsAttribute('a._8mlbc', 'href');
	for (var i  = 0; i< listHrefLinks.length; i++) {
		listHrefLinks[i] = 'https://www.instagram.com' + listHrefLinks[i];
	}
});

casper.then(function() {
	console.log(listHrefLinks);
	this.eachThen(listHrefLinks, function(response) {
		this.thenOpen(response.data, function(response) {
			var foo = this.evaluate(function() {
				return window._sharedData;
			});
			send.to(foo);
		}.bind(this));
	}.bind(this));
});

casper.run();