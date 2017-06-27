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
		case 'kingsage.pl':
		case 'pl.kingsage.gameforge.com':
			return pl; break;
		case 'kingsage.fr':
		case 'fr.kingsage.gameforge.com':
			return fr; break;
		case 'kingsage.tr':
		case 'tr.kingsage.gameforge.com':
			return tr; break;
		case 'kingsage.com':
		case 'kingsage.org':
		case 'en.kingsage.gameforge.com':
		case 'us.kingsage.gameforge.com':
			return en; break;
		default:
			return en; break;
	}
};
