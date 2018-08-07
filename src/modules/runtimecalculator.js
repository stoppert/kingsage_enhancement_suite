(function(kes) {
	kes.module.runtimecalculator = {
		matcher: k.modul.insertIntoRuntimeCalc && page.match('m=runtime_calculator'),
		fn: function() {
			/* FUNCTIONALITY
			 * insert target & source if provided
			 * display eta and grey out units that can not be part of the attack
			 */

			var time, starttime;

			if (page.match('&target=')) {

				var target 		= Query.target.split('|'),
					source 		= Query.source.split('|');

				time 		= Query.time;
				starttime 	= Query.starttime;

				$.kes('saveKey', 'time', time);
				$.kes('saveKey', 'starttime', starttime);

				$('input[id*="start"], input[id*="target"]').kes('multiCheckBoxes', source.concat(target));
				$('input[type*="submit"]').click();

			} else if (page.match('&inta=calculate')) {

				time		= $.kes('deleteKey', 'time');
				starttime 	= $.kes('deleteKey', 'starttime');
				var currenttime = new Date().getTime();

				time = time - Math.floor((currenttime - starttime) / 1000);
				time = (time <= 0) ? 0 : time;
				time = $.kes('prettyTime', time);

				$('table[class*="borderlist"]').eq(4).find('tbody').prepend('<tr><td colspan="3"><p style="color: #DC143C; font-weight: bold; text-align: center;">' + l.runtimecalc + ' ' + time + '</p></td></tr>');

				$('table[class*="borderlist"] > tbody > tr > td[class*="right"]').each(function () {
					var runtime_unit 	= $(this).text().split(':'),
						timeInSeconds 	= time.split(':');

					var inSeconds = function(time) {
						return parseInt10(time[0]) * 3600 + parseInt10(time[1]) * 60 + parseInt10(time[2]);
					};

					var runtimeInSeconds = inSeconds(runtime_unit);
						timeInSeconds 	 = inSeconds(timeInSeconds);

					if (timeInSeconds > runtimeInSeconds) { $(this).css('color', 'grey'); }
				});
			}
		}
	};
}(kes));
