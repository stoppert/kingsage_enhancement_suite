var selectLanguage = function(lang){
	switch(lang) {
		case 'br.kingsage.gameforge.com':
			return br; break;
		case 'de.kingsage.gameforge.com':
			return de; break;
		case 'en.kingsage.gameforge.com':
		case 'us.kingsage.gameforge.com':
			return en; break;
		default:
			return en; break;
	}
};
