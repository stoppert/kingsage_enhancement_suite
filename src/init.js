var $ = (typeof(unsafeWindow) != 'undefined') ? unsafeWindow.jQuery : jQuery || $;

var location = window.location;

var languageSelector = location.host; // e.g. s1.kingsage.de
languageSelector = languageSelector.substring(languageSelector.indexOf('.')+1,languageSelector.length); // e.g. kingsage.de
var loca = selectLanguage(languageSelector);

//* Extract uri parameters
var Query = (function () {
	var query = {}, pair,
	search = location.search.substring(1).split("&"),
	i = search.length;
	while (i--) {
		pair = search[i].split("=");
		query[pair[0]] = decodeURIComponent(pair[1]);
	}
	return query;
})();

var kes = {},
	l = loca;
	
	kes.module = {};
