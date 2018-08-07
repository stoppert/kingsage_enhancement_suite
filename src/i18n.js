var selectLanguage = function(lang){
	switch(lang) {
		case 'br.kingsage.gameforge.com':
			return br;
		case 'kingsage.de':
		case 'de.kingsage.gameforge.com':
			return de;
		case 'kingsage.nl':
		case 'nl.kingsage.gameforge.com':
			return nl;
		case 'kingsage.pl':
		case 'pl.kingsage.gameforge.com':
			return pl;
		case 'kingsage.fr':
		case 'fr.kingsage.gameforge.com':
			return fr;
		case 'kingsage.tr':
		case 'tr.kingsage.gameforge.com':
			return tr;
		case 'kingsage.com':
		case 'kingsage.org':
		case 'en.kingsage.gameforge.com':
		case 'us.kingsage.gameforge.com':
			return en;
		default:
			return en;
	}
};
