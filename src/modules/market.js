(function(kes) {
	kes.module.market = {
		matcher: k.modul.marketOptions && page.match('s=build_market') && !page.match('inta') && identifyActiveTab('s=build_market&m=send'),
		fn: function() {
			/* FUNCTIONALITY
			 * save last target
			 * insert marketoptions specified in the settings
			 */

			var avail_res = []; // stone, wood, iron

			//* fill in last target
			if ($.kes('isKey', 'kes_lastMarketTarget') && $('input[id="send_x"], input[id="send_y"]').val() == '') {
				var lastTarget = $.kes('loadKey', 'kes_lastMarketTarget');
					lastTarget = lastTarget.split('|');
				$('input[id="send_x"]').val(lastTarget[0]); $('input[id="send_y"]').val(lastTarget[1]);
			}
			//* save target on submit
			$('input[type="submit"]').click(function () {
				var target = $('input[id="send_x"]').val() + '|' + $('input[id="send_y"]').val();
				$.kes('saveKey', 'kes_lastMarketTarget', target);
			});
			//* get avail ressources from values after inputs
			$('table[class*="borderlist"]').eq(3).find('span').each(function () {
				avail_res.push($(this).text().replace(/[\(\)\.]/g, ''));
			});

			var avail_donkeys = $('table[class*="borderlist"]').eq(2).find('tr').eq(1).find('td').eq(0).text();
			// match numbers in string and returns first (current donkey count), this fixes problems in versions that have 2 words for donkey (russia) which broke the first implementation
			avail_donkeys = avail_donkeys.match(/(\d+)/)[0];

			function calculateRes(avail_donkeys, avail_res, wanted_res) {
				var out = [], sum = parseInt10(wanted_res[0]) + parseInt10(wanted_res[1]) + parseInt10(wanted_res[2]);
				//* check if enough donkeys are there
				if (sum <= (parseInt10(avail_donkeys) * 1000)) {
					//* just send res when there are enough
					for (var i = 0; i < 3; i++) {
						if (parseInt10(avail_res[i]) > parseInt10(wanted_res[i])) {
							out.push(wanted_res[i]);
						} else {
							out.push(avail_res[i]);
						}
					}
				} else {
					//* check how to divide res
					var donkeys = parseInt10(avail_donkeys) * 1000, scale = donkeys / sum;
					for(var i = 0; i < 3; i++) {
						if (parseInt10(avail_res[i]) > parseInt10(parseInt10(wanted_res[i]) * scale)) {
							out.push(parseInt10(parseInt10(wanted_res[i]) * scale));
						} else {
							out.push(avail_res[i]);
						}
					}
				}
				$('input[name*="send_res"]').kes('multiCheckBoxes', out);
			}
			calculateRes(avail_donkeys, avail_res, [k.market[k.market.d3fault].stone, k.market[k.market.d3fault].wood, k.market[k.market.d3fault].iron]);

			//* append marketoptions
			function createOptions(market) {
				var o = '';
				for(var opt in market) {
					if (market.hasOwnProperty(opt) && opt != 'd3fault') {
						o += ' <span id="kes_market_' + opt + '" opt="' + opt + '" class="click kes_mark">' + arrow + ' ' + market[opt].name + '</span>';
					}
				}
				return o;
			};

			$('table[class*="borderlist"]').eq(3).append('<tr><td colspan="3"><span id="kes_market_all"  opt="0" class="click kes_mark">' + arrow + ' ' + l.all + '</span>' + createOptions(k.market) +'</tr>');
			$('span[id*="kes_market_"]').bind('click', function () {
				var wanted_res = [], opt = $(this).attr('opt');
				switch (opt) {
					case '0': wanted_res.push('950000', '950000', '950000'); break;
					default: wanted_res.push(k.market[opt].stone, k.market[opt].wood, k.market[opt].iron); break;
				}
				calculateRes(avail_donkeys, avail_res, wanted_res);
			});
		}
	};
}(kes));
