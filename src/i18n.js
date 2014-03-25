var selectLanguage = function(lang){
	switch(lang) {
		case 'br.kingsage.gameforge.com':
			return br; break;
		case 'kingsage.de':
		case 'de.kingsage.gameforge.com':
			return de; break;
		case 'kingsage.nl':
		case 'nl.kingsage.gameforge.com':
			return nl; break;
		case 'kingsage.com':
		case 'kingsage.org':
		case 'en.kingsage.gameforge.com':
		case 'us.kingsage.gameforge.com':
			return en; break;
		default:
			return en; break;
	}
};
