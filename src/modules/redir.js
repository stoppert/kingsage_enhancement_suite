(function(kes) {
	kes.module.redir = {
		matcher: page.match('redir.php'),
		fn: function() {
			/* FUNCTIONALITY
			 * properly unescape urls in the redirect.php script
			 */
			var link = $('.contentpane').find('a'),
				href = link.attr('href');
				href = $('<div/>').html(href).text();

			link.text(href).prop('href', href);
		}
	};
}(kes));
