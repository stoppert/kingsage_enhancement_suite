(function(kes) {
	kes.module.attacks = {
		matcher: page.match('m=attacks'),
		fn: function() {
			/* FUNCTIONALITY
			 * insert attack into runtimecalc if enabled
			 * save attack to be displayed on map
			 * display incomming attacks with seconds
			 */

			var table = $('table.borderlist').eq(2);

			function insertIntoRuntimeCalc() {
				if (k.modul.insertIntoRuntimeCalc) {
					$('table.borderlist').eq(2).find('tr').each(function () {
						var cur = $(this);
						if (cur.find('td[class*="list"]')) {
							var children = cur.children();
							var data	 = '&target=' + children.eq(1).find('a:last').html() + '&source=' + children.eq(2).find('a:last').html() + '&time=' + children.eq(4).find('span').attr('time') + '&starttime=' + new Date().getTime();
							//* add link to runtimecalc
							children.eq(0).find('img').replaceWith('<a target="_blank" href="/game.php?&s=tools&m=runtime_calculator' + data + av + '"><img src="/img/command/attack.png"></a>');
						}
					});
				}
			}

			//* load all existing pages!
			//* make ui
			table.before('<span class="click" id="kes_allAttacks">' +  arrow + ' (kes) ' + l.loadAllAttacks + '<br /><br /></span>');

			//* we need the last pagination link to an attack page and the currently displayed page from the url
			var lastPage = $('table.borderlist').eq(2).find('a[href*="attacks&start"]:last').attr('href'),
				display  = document.URL;

			function getPages(last, display) {
				var lastN = (typeof(last) == 'undefined') ? 0 : last.substring(last.indexOf('&start=') + 7);
				if (display.indexOf('&start') > 0) {
					// the url says we are not starting from zero, that means we have to determine whether or not we are currently viewing the last page or if the last pagination link is valid
					var	displayN = display.substring(display.indexOf('&start=') + 7);
					return (lastN > displayN) ? lastN : displayN;
				} else {
					//we are on the first attack page, the pagination link is valid and we can just return that
					return lastN;
				}
			}

			function createQueue(pagesRaw) {
				var pages	= pagesRaw/50 + 1,
					step	= 50,
					url 	= '/game.php?s=ally&m=attacks&start=' + av,
					queue 	= [];
				for(var i = 0; i < pages; i++) {
					queue.push(url + (i*step));
				}
				return queue;
			}

			var pages 		= getPages(lastPage, display),
				pageQueue 	= createQueue(pages),
				queueLength = pageQueue.length;

			$('#kes_allAttacks').bind('click', function () {

				$(this).replaceWith('<span id="kes_allAttacks">' + l.loading + '... (' + (queueLength - pageQueue.length) + '/' + queueLength + ')<br /><br /></span>');
				// queueloader
				table.find('tr > td').parent().remove();
				var getAttacks = function (page) {
					$.ajax({
						type: 'POST',
						url: page.shift(),
						success: function (data) {
							var attacks = $(data).find('table.borderlist').eq(2).find('img').parent().parent();
							$('table.borderlist').eq(2).append(attacks);
							if (page.length > 0) {
								$('#kes_allAttacks').replaceWith('<span id="kes_allAttacks">' + l.loading + '... (' + (queueLength - pageQueue.length) + '/' + queueLength + ')<br /><br /></span>');
								getAttacks(page);
							} else {
								$('#kes_allAttacks').replaceWith('<span id="kes_allAttacks">' + l.loadingFinished + '<br /><br /></span>');
								setTimeout(function () { $('#kes_allAttacks').kes('fadeOutRemove'); }, 800);

								displayAttacksWithSeconds(2);
								insertIntoRuntimeCalc();
								window.timersDown = []; // reset timers array so that the page doesnt get reloaded

								//filter ui
								table.prepend('<tr style="height: 35px;"><td colspan="4"><form id="kes_filterOption"><input type="radio" name="filter" value="attacker" id="kes_filterAttacker" class="filter"> ' + l.attacker + '\
									<input type="radio" id="kes_filterDefender" value="defender" name="filter" checked="checked" class="filter"> ' + l.defender + '<span style="width: 25px; display: inline-block"> </span>' +  l.nameCoords + ': <input style="width: 100px;" type="text" id="kes_filterInput"> <span id="kes_attackRowCount"></span></div></td>\
									<td colspan="1"><span class="click" id="kes_resetFilter">' + arrow + ' ' + l.reset + '</span></td></tr>');

								//load last target
								if ($.kes('isKey', 'kes_lastAttackFilterInput')) {
									$('#kes_filterInput').val($.kes('loadKey', 'kes_lastAttackFilterInput'));
								}

								// TODO limit for MANY attacks?!
								var filterAttacks = function (event) {

									var keycodes = [ 9, 16, 17, 18, 20, 33, 34, 35];

									if(!event || keycodes.indexOf(event.keyCode) > -1) return;

									var filterOption = $('#kes_filterOption').find('input[type="radio"]:checked').val(),
										filterInput  = $('#kes_filterInput').val();
									if (filterInput == "") {
										// we need more input
										if(event.keyCode != 8) {
											$('#kes_filterInput').css('border', '1px solid red').effect('pulsate', 300, function () { $(this).css('border', '1px solid #CFAB65'); });
										}
									} else {
										//save input
										$.kes('saveKey', 'kes_lastAttackFilterInput', filterInput);
										//start filtering
										var target = (filterOption == 'attacker') ? 2 : 1; // attacker has column 2 in the table defender has column 1
										table.find('tr:gt(1)').show().filter(function () {
											return ($(this).find('td:eq(' + target + ')').text().search(new RegExp(filterInput, "i")) < 0);
										}).hide();

										var attackRowCount = $('table.borderlist').eq(2).find('tr:gt(1)').filter(function () { return ($(this).css('display') != 'none'); }).length;

										var suffix = (attackRowCount != 1) ? ' ' + l.attacks : ' ' + l.attack;
										$('#kes_attackRowCount').text(attackRowCount + suffix);
									}
								};

								$('#kes_filterInput').bind('keyup', filterAttacks);
								$('#kes_resetFilter').bind('click', function () { table.find('tr:gt(1)').show(); });
								$('#kes_filterOption').submit(function(event) { event.preventDefault(); });

								filterAttacks();
							}
						}
					});
				};
				getAttacks(pageQueue);
			});

			displayAttacksWithSeconds(2);
			insertIntoRuntimeCalc();

			if (k.modul.showAttacksOnMap) {
				var display_delete = 'none';
				if ($.kes('isKey', 'kes_save_attacks')) {
					display_delete = 'inline';
					filterOverdueAttacks($.kes('loadKey', 'kes_save_attacks'));
				}
				$('table[class*="borderlist"]').eq(2).prepend('<tr><td colspan="5"><span id="kes_save_attacks" class="click kes_mark">' + l.saveAttacks + '</span> \
					<span id="kes_save_attacks_success" style="display: none; color: green;"> ' + l.saved + '!</span> \
					<span style="display: ' + display_delete + ';" class="click kes_mark" id="kes_delete_attacks">' + l.resetSavedAttacks + '</td></tr>');

				$('#kes_save_attacks').bind('click', function () {
					var kes_attacks = {};
					$('table[class*="borderlist"]').eq(2).find('tr > td[class*="list"]').parent().each(function () {
						var attack		 	= $(this).find('td');
						var def_attack_name = attack.eq(0).text();
						var def_villageId   = attack.eq(1).find('a[href*="info_village"]').attr('href');
						def_villageId	   = def_villageId.substring(def_villageId.lastIndexOf('id=') + 3);
						var off_player	  = attack.eq(2).find('a[href*="info_player"]').html();
						var off_playerId	= attack.eq(2).find('a[href*="info_player"]').attr('href');
						off_playerId		= off_playerId.substring(off_playerId.lastIndexOf('id=') + 3);
						var off_village	 = attack.eq(2).find('a[href*="info_village"]').html();
						var off_villageId   = attack.eq(2).find('a[href*="info_village"]').attr('href');
						off_villageId	   = off_villageId.substring(off_villageId.lastIndexOf('id=') + 3);
						var off_ally		= '-';
						var off_allyId	  = '-';
						if (attack.eq(2).find('a[href*="info_ally"]').html()) {
							off_ally   = attack.eq(2).find('a[href*="info_ally"]').html();
							off_allyId = attack.eq(2).find('a[href*="info_ally"]').attr('href');
							off_allyId = off_allyId.substring(off_allyId.lastIndexOf('id=') + 3);
						}
						// sanitize ids from av
						if (av != '') {
							def_villageId 	= def_villageId.replace(av, '');
							off_playerId 	= off_playerId.replace(av, '');
							off_villageId 	= off_villageId.replace(av, '');
							off_allyId 		= off_allyId.replace(av, '');
						}
						var attack_timeleft = attack.eq(4).find('span').attr('time');
						attack_timeleft	 = (Date.parse(new Date()) / 1000) + parseInt10(attack_timeleft);
						var single_attack = {0: off_player, 1: off_playerId, 2: off_village, 3: off_villageId, 4: off_ally, 5: off_allyId, 6: attack_timeleft, 7: def_attack_name};
						if (kes_attacks.hasOwnProperty(def_villageId)) {
							kes_attacks[def_villageId].length = kes_attacks[def_villageId].length+1;
							kes_attacks[def_villageId][kes_attacks[def_villageId].length] = single_attack;
						} else {
							kes_attacks[def_villageId] = {};
							kes_attacks[def_villageId].length = 0;
							kes_attacks[def_villageId][kes_attacks[def_villageId].length] = single_attack;
						}
					});
					$.kes('saveKey', 'kes_save_attacks', kes_attacks);
					$('#kes_save_attacks_success').fadeIn('slow').fadeOut('fast');
				});
				$('#kes_delete_attacks').bind('click', function () {
					$(this).fadeOut('slow');
					$.kes('deleteKey', 'kes_save_attacks');
				});
			}
		}
	};
}(kes));
