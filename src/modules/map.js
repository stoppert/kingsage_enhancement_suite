css += '#kes_show_attack_info { position: fixed; z-index: 150; box-shadow: 1px 1px 5px #000; display: none; top: 5px; left: 5px; min-width: 250px; max-width: 350px; background-color: #fff; opacity: .9; }';
css += '#kes_errorbox { position: fixed; width: 500px; z-index: 150; box-shadow: 1px 1px 5px rgb(0, 0, 0); line-height: 1.2; text-align: left; padding:5px; top: 25px; left: 25px; color: #fff; font-size: 11pt; background-color: #871919; }';
css += '.kes_hastroops { position: absolute; padding: 1px; border: 1px solid black; width: 10px; height: 9px; line-height: 8px; font-weight: bold; }';
css += '#kes_box { background-color: #fff; display: none; border-radius: 5px; position: fixed; width: 500px; left: 50%; top: 5%; margin-left: -250px; padding: 6px; z-index: 200; }';

(function(kes) {
	kes.module.map = {
		matcher: page.match('s=map'),
		fn: function() {
			/* FUNCTIONALITY
			 * handle map enhancements
			 * display errorbox if troops on map is not available because map setting is disabled or not reasearched yet
			 * traverse the map for settlements with attack, groups or troops to be highlighted
			 * display attacks in a box on mouseover
			 * target export for displayed minimap-area
			 */

			var mapOptionActivated = ($('input[name="map_show_troups"]').attr('checked') == 'checked') ? mapOptionActivated = true : mapOptionActivated = false;
			if (k.modul.troopsOnMap && !mapOptionActivated) {
				//* append notice to activate option
				var cssErrorbox = '';
				$('body').append('<div id="kes_errorbox"></div>');
				if ($('input[name="map_show_troups"]').length == 0) {
					$('#kes_errorbox').html(l.highlighttroopsError);
				} else {
					$('#kes_errorbox').html(l.highlighttroopsActivate);
				}
			}

			if (k.modul.showAttacksOnMap) {
				var saved_attacks = false, attacks = {};
				if ($.kes('isKey', 'kes_save_attacks')) {
					saved_attacks = true;
					attacks = $.kes('loadKey', 'kes_save_attacks');
					//* Check for each attack if it's already overdue, if so remove it
					filterOverdueAttacks(attacks);
				}
			}

			function mapStateChanges() {
				$('td[class*="occupied"] > div > a').each(function () {
					var active = false;
					var meta = $(this).parent().html();
					meta = meta.substring(meta.indexOf('onmouseover'), meta.indexOf('onmouseout') - 1);
					var metaSplit = meta.split(',');
					var village = $(this).attr('href');
					village = village.substring(village.lastIndexOf('id=') + 3);
					// remove av id
					if (av != '') {
						village = village.replace(av, '');
					}
					var playerName = metaSplit[3].substr(2, metaSplit[3].indexOf(' (') - 2);
					//* check if settlement belongs to the user
					var isThisMe = (self.match(playerName) && playerName != '');
					//* mark troops if enabled
					if (k.modul.troopsOnMap && isThisMe && mapOptionActivated) {
						function hasTroops(troops, units, amount) {
							var result = false, unit_1 = units[0], unit_2 = units[1];
							//troops are displayed with [.] so the dots have to be replaced
							if (parseInt10(unit_2) == 12) {
								if (parseInt10(troops[unit_1].replace(/\./g, '')) > amount[0]-1) { result = true; }
							} else {
								if (parseInt10(troops[unit_1].replace(/\./g, '')) > amount[0]-1 && parseInt10(troops[unit_2].replace(/\./g, '')) > amount[1]-1) { result = true; }
							}
							return result;
						}
						//* extract troops
						var troops = metaSplit[metaSplit.length - 4];
						//* sanitize troop string
						troops = troops.substring(2, troops.length -1 );
						troops = troops.split(':');

						function drawTroops(elem, troops, modules, pos) {
							for(var m in modules) {
								if(modules.hasOwnProperty(m)) {
									if(modules[m] && hasTroops(troops, [k.units[m].one.unit, k.units[m].two.unit], [k.units[m].one.amount, k.units[m].two.amount])) {
										elem.append('<div class="kes_hastroops" style="background-color: ' + k.units[m].color + '; color: ' + draw.helper.getContrast(k.units[m].color.substring(1)) + '; top: ' + pos[m].top +'; right: ' + pos[m].right +';">' + k.units[m].abbr +'</div>');
									}
								}
							}
						}
						drawTroops($(this), troops, k.units.modul, {def: {top: '2px', right: '2px'}, off: {top: '2px', right: '15px'}, count: {top: '14px', right: '2px'}, spy: {top: '14px', right: '15px'}});
					}
					//* check for groups to be highlighted if enabled
					if (k.modul.highlightgroups && isThisMe) {
						//* is one group of the grouparray in meta?
						function isSettlementInGroup(meta, groups) {
							var result = false;
							if (Object.getOwnPropertyNames(groups).length != 0) {
								for(var item in groups) {
									if (meta.indexOf(groups[item]) != -1) {
										result = true;
										break;
									}
								}
							}
							return result;
						}
						//* is this a group that we want to highlight?
						if (isSettlementInGroup(meta, k.highlightgroups.one.group)) {
							$(this).attr('kes_g_one', k.highlightgroups.one.name);
						}
						if (isSettlementInGroup(meta, k.highlightgroups.two.group)) {
							$(this).attr('kes_g_two', k.highlightgroups.two.name);
						}
						//* mark groups
						if ($(this).attr('kes_g_one') && $(this).attr('kes_g_two')) {
							$(this).append('<div style="position: absolute; padding: 1px; border-radius: 5px; border: 1px solid black; background-color: #FF7F50;  bottom: 2px; left: 2px; width: 5px; height: 5px;"></div>');
						} else {
							var cssMapGroups = 'position: absolute; padding: 1px; border-radius: 3px; bottom: 0px; left: 0px;';
							if ($(this).attr('kes_g_one')) {
								$(this).append('<div style="' + cssMapGroups + ' background-color:' + k.highlightgroups.one.color + '; color: ' + draw.helper.getContrast(k.highlightgroups.one.color.substring(1)) + ';"><span>' + $(this).attr('kes_g_one') + '</span></div>');
							}
							if ($(this).attr('kes_g_two')) {
								$(this).append('<div style="' + cssMapGroups + ' background-color:' + k.highlightgroups.two.color + '; color: ' + draw.helper.getContrast(k.highlightgroups.two.color.substring(1)) + ';"><span>' + $(this).attr('kes_g_two') + '</span></div>');
							}
						}
					}
					//* check for attacks is enabled
					if (k.modul.showAttacksOnMap && saved_attacks) {
						//* is the village being attacked?
						if (attacks.hasOwnProperty(village)) {
							$(this).attr('kes_villageId', village).parent().parent().attr('attacked', 'true');
						}
					}
				});
			}
			$(document).ready(function () {
				mapStateChanges();
				$('td[title], div[id*="minimap"]').live('click', mapStateChanges);

				if (k.modul.showAttacksOnMap) {
					$('body').append('<div id="kes_show_attack_info">\
						<table>\
							<tr><td id="n"></td><td align="right"><span class="click kes_mark" id="kes_close_attack_info">' + l.close + '</span></td></tr>\
							<tr><td colspan="2"><u>' + l.attacker + '</u></td></tr>\
							<tr><td>' + l.nick + ': </td><td id="p"></td></tr><tr><td>' + l.settlement + ': </td><td id="v"></td></tr>\
							<tr><td>' + l.ally + ': </td><td id="a"></td></tr><tr><td>' + l.arrival + ': </td><td id="t"></td></tr>\
							<tr><td>' + l.moreAttacks + ': </td><td id="m"></td></tr><tr><td id="s" colspan="2"></td></tr>\
						</table></div>');

					function showAttackInformation(villageId) {
						var village_attacks = attacks[villageId], len = village_attacks.length;
						var attack_single = village_attacks[0];

						var time = attack_single[6], n = attack_single[7];
						time = $.kes('prettyTime', parseInt10(time) - (Date.parse(new Date()) / 1000));
						// Alle Angriffe oder nur 20 Angrife anzeigen
						var size = Math.min(len, 20);
						function moreAttacks() { return (len == 0) ? l.none : len; };

						$('#kes_show_attack_info').find('td[id*="n"]').html('<b>' + n + '</b>')
							.end().find('td[id*="p"]').html('<a href="/game.php?s=info_player&id=' + attack_single[1] + av +'" target="_blank">' + attack_single[0] + '</a>')
								.end().find('td[id*="v"]').html('<a href="/game.php?s=info_village&id=' + attack_single[3] + av +'" target="_blank">' + attack_single[2] + '</a>')
									.end().find('td[id*="a"]').html('<a href="/game.php?s=info_ally&id=' + attack_single[5] + av +'" target="_blank">' + attack_single[4] + '</a>')
										.end().find('td[id*="t"]').html(time)
											.end().find('td[id*="m"]').html(moreAttacks())
												.end().find('td[id*="s"]').attr('villageId', villageId)
													.end().find('td[id*="s"]').html(showNextTwenty())
														.end().fadeIn('slow');

						function showNextTwenty() {
							var o;
							if (len == 0) {
								return '';
							} else {
								o = '<span style="text-align: center;" id="kes_show_all">' + printf(l.nextAttacks, size) + '</span><table>';
								for (var i = 1; i <= size; i++) {
									var attack_info = village_attacks[i];
									var y = $.kes('prettyTime', parseInt10(attack_info[6]) - (Date.parse(new Date()) / 1000));
									o += '<tr><td><a href="/game.php?s=info_player&id=' + attack_info[1] + av +'" target="_blank">' + attack_info[0] + '</a></td>';
									o += '<td><a href="/game.php?s=info_village&id=' + attack_info[3] + av +'" target="_blank">' + attack_info[2] + '</a></td><td><b>' + attack_info[7] + '</b></td><td>' + y + '</td></tr>';
								}
								o += '</table>';
								return o;
							}
						}
					}

					function pulse(element) {
						$(element).fadeOut(700).fadeIn(700);
						setTimeout(function () { pulse(element); }, 800);
					}
					pulse('td[attacked*="true"]');

					$('td[attacked*="true"]').live('mouseover', function () {
						showAttackInformation($(this).find('a').attr('kes_villageid'));
					});
					$('#kes_close_attack_info').bind('click', function () {
						$('#kes_show_attack_info').fadeOut();
					});
				}

				//*** targetexport
				//* add ui for target export
				if (k.modul.targetExport) {
					$('#mapContainer').parent().before('<form action="javascript:void(0);">' + l.player + ': <input type="text" id="kes_target"> <input type="checkbox" id="kes_onlyAbandoned"> ' + l.onlyAbandoned + '<input type="checkbox" id="kes_showAsMessage"> ' +l.asBBCode + ' <input type="submit" value="(kes) ' + l.targetExport + '" id="kes_targetExportSubmit"> <span id="kes_targetExport_error" style="color: crimson; font-weight: bold; display: none;"></span></form><br />');
					//* add handler
					$('#kes_targetExportSubmit').click(function () {
						var results = [], target = $('#kes_target').val(), onlyAbandoned = ($('#kes_onlyAbandoned:checked').length == 1);

						//* assemble data
						$('td[class*="occupied"] > div > a').each(function () {
							var meta = $(this).attr('onmouseover');
							var metaSplit = meta.split(',');

							var user = metaSplit[3];
							//* extract coordinates
							var coordinates = meta.match(/\d+\|\d+/);

							var isAbandoned = ($(this).find('img').attr('src').match(/_left.png$/));

							if(onlyAbandoned) {

								if(isAbandoned) {
									results.push(coordinates);
								}

							} else {

								if (user.match(target) != null) {
									results.push(coordinates);
								}

							}

						});

						var displayDataAsBBCode = function (data) {
							var r = data.length + ' ' + l.entries + ' \n';
							for(var i in data) {
								if(data.hasOwnProperty(i)) {	
									r += '[village]' + data[i] + '[/village] \n';
								}
							}
							return r.substring(0,r.length-2);
						};

						var displayDataAsList = function (data) {
							var r = data.length + ' ' + l.entries + ' \n';
							for(var i in data) {
								if(data.hasOwnProperty(i)) {	
									r += '"' + data[i] + '",' + '\n';
								}
							}
							return r.substring(0,r.length-2);
						};

						if (results.length > 0) {
							if ($('#kes_targetExport_error:visible').length == 1) {
								$('#kes_targetExport_error').fadeOut();
							}

							var creator = ($('#kes_showAsMessage:checked').length == 1) ? displayDataAsBBCode : displayDataAsList;
							$.kes('genericBBCode', creator, results);

						} else {
							$('#kes_targetExport_error').text(l.noMatch + '.').fadeIn();
						}
					});
				}

				if(k.modul.setGroupsOnMap && premium) {
					// getgroups
					var groups = $.makeArray($('#container_group_drop_down').find('a:gt(0)')).map(function(t, i) { return {id: $.kes('getUrlParameters', $(t).attr('href'))['group'], name: $(t).text() }; }),
						options = groups.map(function(i) { return '<option value="' + i.id + '">' + i.name + '</option>'; });

					$('#mapContainer').parent().before('<div id="kes_setGroupsOnMap"><select id="kes_setGroupsOnMap_select">' + options.join() + '</select> <input type="submit" id="kes_setGroupsOnMap_submit" value="' + l.setGroup + '"> <span id="kes_setGroupsOnMap_success" style="display: none; font-weight: bold;">' + l.saved + '</span></div><br />');

					$('#kes_setGroupsOnMap_submit').click(function() {
						// have to check if group is set to all

						var allGroup = $('#group_drop_down').find('table tr td').eq(0);
						if(allGroup.hasClass('marked')) {
							// reset success icon
							$('#kes_setGroupsOnMap_saved').remove();

							var groupID = $('#kes_setGroupsOnMap_select').val(),
								settlements = [],
								o = 0, n = 0,
								getVillagesOfGroup = function(groupID) {
									return $.ajax({
										type: 'post',
										url: 'popup.php?s=groups&group_id=' + groupID + av
									});
								};

							$.when(getVillagesOfGroup(groupID)).then(function(raw) {
								selectedSetts = $(raw).find('input:checked');
								selectedSetts.each(function() {
									settlements.push($(this).val());
								});

								// old groupcount
								o = settlements.length;

								$('td[class*="occupied"] > div > a').each(function () {
									var meta = $(this).attr('onmouseover'),
										user = meta.split(',')[3],
										id = $.kes('getUrlParameters', $(this).attr('href'))['id'];

										if(user.match(self)) {
											// this is us, probably doesnt matter but we'll check anyways
											if(settlements.indexOf(id) == -1) {
												// settlement is not yet checked thus add
												settlements.push(id);
											}
										}
								});

								// new groupcount
								n = settlements.length;

								if(n != o) {
									$.ajax({
										type: 'post',
										url: 'popup.php?s=groups&m=define&inta=modifyVillageGroups&group_id=' + groupID + av,
										data: 'vg[]=' + settlements.join('&vg[]='),
										success: function() {
											//report success
											$('#kes_setGroupsOnMap_success').css({color: 'green'}).kes('fadeInfadeOut').before('<span id="kes_setGroupsOnMap_saved" class="kes-icons kes-icon-saved"></span>');
										}
									});
								} else {
									$('#kes_setGroupsOnMap_success').css({color: 'green'}).kes('fadeInfadeOut').before('<span id="kes_setGroupsOnMap_saved" class="kes-icons kes-icon-saved"></span>');
								}

							});

						} else {
							// switch the group to all
							if(confirm(l.switchGroup)) {
								location.href = allGroup.find('a').attr('href');
							}
						}

					});

				}

			});
		}
	};
}(kes));
