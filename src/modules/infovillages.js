(function(kes) {
	kes.module.infovillages = {
		matcher: page.match('s=info_village'),
		fn: function() {
			/* FUNCTIONALITY
			 * add shortcuts to barracks and main building to every village info page
			 * add shortcuts to attack (with spies or without)
			 */
			
			var target  = $('a[href*="&s=build_barracks&m=command&target="]').attr('href'),
				id 		= Query['id'],
				player  = $('a[href*="info_player&"]').text();

			if (self.match(player) && player != "") {
				// this is me add links to switch to main / barracks
				$('a[href*="edit_player_colors"]').after('<br /><span><a href="/game.php?village=' + id + '&s=build_barracks' + av + '">' + arrow + ' ' + l.goToBarracks + '</a></span><br />\
					<span><a href="/game.php?village=' + id + '&s=build_main' + av + '">' + arrow + ' ' + l.goToMain + '</a></span>');
			} else {
				// this is an enemy add links to spy attack, barracks and insert koords
				$('a[href*="&s=build_barracks&m=command&target="]').after('<br /><a href="' + target + '&spy=' + k.spylink_amount+ '">' + arrow + ' ' + printf(l.attackWithSpies, k.spylink_amount) +'</a>');
			}
		}
	};
}(kes));
