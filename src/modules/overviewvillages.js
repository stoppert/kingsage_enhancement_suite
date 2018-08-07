css += '.kes_multiselect { display: none; }';
css += '.kes_multiselect_open { display: block !important; }';

(function(kes) {
	kes.module.overviewvillages = {
		matcher: premium && page.match('s=overview_villages'),
		fn: function() {
			if (k.modul.filterOverview && identifyActiveTab('s=overview_villages&m=1')) {

				/* FUNCTIONALITY
				 * calculates distance to a target
				 * sorts settlements according to runtime
				 * also filters for a specified unit minimum
				 */

				var unit_runtime = { "farmer": 20, "sword": 22, "spear": 18, "axe": 18, "bow": 18, "spy": 9, "light": 10, "heavy": 11, "ram": 30, "kata": 30, "snob": 35};

				var head = '';
				$('table.borderlist').eq(3).find('tr:first > th:gt(4)').each(function () { head += '<td>' + $(this).html() + '</td>'; });

				var ui =  '<table id="filterTroops_table" class="borderlist" style="width: 820px;">';
					ui +=	'<tr><td><span id="kes_filterTroops_status">' + l.troopFilter + '</span></td>' + head + '</tr>';
					ui +=	'<tr><td><input id="kes_filterTroops"  value="' + l.filter + '" type="submit"></td><td><input type="text" name="farmer" size="4" maxlength="5"></td>';
					ui += 		'<td><input type="text" name="sword" size="4" maxlength="5"></td><td><input type="text" name="spear" size="4" maxlength="5"></td>';
					ui += 		'<td><input type="text" name="axe" size="4" maxlength="5"></td><td><input type="text" name="bow" size="4" maxlength="5"></td>';
					ui +=		'<td><input type="text" name="spy" size="4" maxlength="5"></td><td><input type="text" name="light" size="4" maxlength="5"></td>';
					ui +=		'<td><input type="text" name="heavy" size="4" maxlength="5"></td><td><input type="text" name="ram" size="4" maxlength="5"></td>';
					ui += 		'<td><input type="text" name="kata" size="4" maxlength="5"></td><td><input type="text" name="snob" size="4" maxlength="5"></td></tr>';
					ui += 	'<tr><td>' + l.target +': <input id="kes_filterTroops_target" type="text" size="7"></td>';
					ui +=		'<td colspan="10">' + l.toa + ': ';
					ui +=				l.days +' <input id="kes_filterTroops_arrival_d" type="text" size="2">' + l.hours + ' <input id="kes_filterTroops_arrival_h" type="text" size="2">';
					ui +=			l.minutes + ' <input id="kes_filterTroops_arrival_m" type="text" size="2"> ' + l.seconds + ' <input id="kes_filterTroops_arrival_s" type="text" size="2">';
					ui +=		' <input type="checkbox" id="kes_filterTroops_onlyTroops">' + l.withoutRuntime + '</td>';
					ui +=		'<td><input type="submit" id="kes_filterTroops_save" value="' + l.save + '"></td>';
					ui +=	'</tr><tr><td colspan="12">' + displayTrooplinks() + '</td></tr></table><br />';

				$('table.borderlist').eq(3).before(ui);

				var getWorldRuntime = function() {
					$.ajax({
						type: 'post',
						url: '/help.php?m=worldinfo',
						success: function (data) {
							var runtime = 1;
							runtime = parseFloat($(data).find('table.borderlist').eq(0).find('tr:gt(1):lt(1) > td:nth-child(2)').html(), 10);
							$.kes('saveKey', 'kes_worldRuntime', runtime);
						}
					});
				};

				if (!$.kes('isKey', 'kes_worldRuntime')) {
					getWorldRuntime();
				}

				var getInput  = function() {
					var t = {};
					$('#filterTroops_table').find('input:gt(0):not(:last)').each(function (i) {
						if (i != 16) {
                            t[i] = ($(this).val() == '') ? 0 : $(this).val();
						} else {
                            t[i] = ($('#kes_filterTroops_onlyTroops:checked').length == 1) ? true : false;
						}
					});
					return t;
				};

				var calculateDistance = function(source, target) {
					var distance = Math.sqrt(Math.pow(Math.abs(parseInt10(source[0]) - parseInt10(target[0])), 2) + Math.pow(Math.abs(parseInt10(source[1]) - parseInt10(target[1])), 2));
					return Math.round(distance*100)/100;
				};

				var checkForTroops = function(wanted, available) {
					var r = false, count_match = 0;
					for(var i = 0;i < wanted.length; i++) { if (parseInt10(wanted[i]) <= parseInt10(available[i])) { count_match++; }}
					r = (count_match == wanted.length);
					return r;
				};

				var createBarracksString = function(troops) {
					var output = '', labels = ['farmer', 'sword', 'spear', 'axe', 'bow', 'spy', 'light', 'heavy', 'ram', 'kata', 'snob'];
					for(var i = 0; i < labels.length; i++) { output += '&' + labels[i] + '=' + troops[i]; }
					return output;
				};

				var getSlowestUnit = function(troops) {
					var units = [20, 22, 22, 18, 18, 9, 10, 11, 30, 30, 35];
					for(var i = 0; i < units.length; i++) {
						if (troops[i] == 0) { units[i] = 0; }
					}
					return Math.max.apply(Math, units);
				};

				//* load settings
				var filterTroopsInput = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: '000|000', 12: 0, 13: 0, 14: 0, 15:0, 16: false};
				if ($.kes('isKey', 'kes_filterTroops')) {
					filterTroopsInput = $.kes('loadKey', 'kes_filterTroops');
				}
				//* fill in settings
				$('#filterTroops_table').find('input:gt(0):not(:last)').each(function (i) {
					if (i != 16) {
						$(this).val(filterTroopsInput[i]);
					} else {
						if (filterTroopsInput[i]) {
							$('#kes_filterTroops_onlyTroops').prop('checked', 'checked');
						}
					}
				});
				//* user events
				$('span.kes_mark').click(function () {
					var number = $(this).attr('id'),
						troops = k.trooplinks[number.substring(number.indexOf('kes_trooplink_') + 14)];
					for(var unit in unit_runtime) {
						if (unit_runtime.hasOwnProperty(unit)) {
							$('input[name="' + unit + '"]').val(troops[unit]);
						}
					}
				});
				// mouseup works for right click
				$('table.borderlist').eq(4).on('click mouseup', '.kes_link_to_barracks', function(e) {
					$(this).closest('tr').find('td').addClass('kes_used');
				});

				$('#kes_filterTroops_save').bind('click', function () {
					$.kes('saveKey', 'kes_filterTroops', getInput());
					$('#kes_filterTroops_status').fadeOut().html(l.saved).css('color', 'green').fadeIn('slow', function () {
						$(this).delay(800).html(l.troopFilter).css('color', 'black').fadeIn();
					});
				});
				$('#kes_filterTroops').bind('click', function () {
					$('table.borderlist').eq(4).find('tr:first > th:nth-child(2)').html(l.toa);
					if (parseInt10($('#kes_filterTroops_noMatch').length) > 0) {
						$('#kes_filterTroops_noMatch').remove();
					}
					var isPaginated 	= false,
						currInput 		= getInput(),
						time 			= parseInt10(currInput[15]) + parseInt10(currInput[14])*60 + parseInt10(currInput[13])*3600 + parseInt10(currInput[12])*86400,
						target 			= currInput[11].split('|'), troops = [currInput[0], currInput[1], currInput[2], currInput[3], currInput[4], currInput[5], currInput[6], currInput[7], currInput[8], currInput[9], currInput[10]],
						barracksString 	= createBarracksString(troops), sortable = [],
						slowestUnit 	= getSlowestUnit(troops),
						lz 				= (1 / parseFloat($.kes('loadKey', 'kes_worldRuntime'), 10)) * parseFloat(slowestUnit, 10) * 60,
						onlyTroops 		= ($('#kes_filterTroops_onlyTroops:checked').length == 1) ? true : false;

					$('table.borderlist').eq(4).find('tr:gt(0)').each(function () {
						//* only if tr is not paginator
						if (!$(this).find('td:first').attr('colspan')) {
							//* collect data
							var source = $(this).find('span[id*="qeText"]').attr('title');
							source = source.match(/[0-9]{3}\|[0-9]{3}/)[0].split('|');
							//* check if runtime is short enough to get there in time
							var distance = calculateDistance(source, target);
							var runtime = Math.ceil(distance*lz);
							if (onlyTroops || runtime < time) {
								//* if there is enough time check if correct amount of troops is available
								var avail_troops = [];
								$(this).find('td:gt(4)').each(function (i) {
									var unit;
									if (i < 10) {
										unit = $(this).attr('title');
										unit = unit.substring(0, unit.indexOf(' '));
										unit = unit.replace(/\./g, '');
									} else {
										unit = $(this).find('a').html();
									}
									avail_troops.push(unit);
								});
								//* has this settlement to be visible or hidden?
								if (!checkForTroops(troops, avail_troops)) {
									$(this).css('display', 'none');
								} else {
									var id = $(this).find('td:first').find('a').attr('href');
										id = id.substring(0, id.lastIndexOf('&s=')+3);
									$(this).attr('time', runtime).css('display', 'table-row').find('td:nth-child(2)').html('<a class="kes_link_to_barracks" href="' + id + 'build_barracks&m=command' + barracksString + '&send_x=' + target[0] + '&send_y=' + target[1] + av +'" target="_blank">' + $.kes('prettyTime', runtime) + '</a>');
									sortable.push(runtime);
								}
							} else {
								$(this).css('display', 'none');
							}
						} else { isPaginated = true; $(this).addClass('pagination'); }
					});
					var tbody = $('table.borderlist').eq(4).find('tbody');
					if (parseInt10($('table.borderlist').eq(4).find('tr:gt(0):visible').not('.pagination').length) == 0) {
						var appendice = '<tr id="kes_filterTroops_noMatch"><td colspan="16">' + l.noMatch + '.</td></tr>';
						if (isPaginated) {
							$('table.borderlist').eq(4).find('.pagination:first').after(appendice);
						} else {
							$('table.borderlist').eq(4).find('tr:visible').after(appendice);
						}
					} else {
						//* sort array
						sortable.sort(function (a,b) { return a-b; });
						//* move rows around to fit sort order
						$.each(sortable, function (i, time) { $('table.borderlist').eq(4).find('tr[time*="' + sortable[i] + '"]').appendTo(tbody);});
						if(isPaginated) {
							$('table.borderlist').eq(4).find('.pagination:last').appendTo(tbody);
						}
					}
				});

			} else if (identifyActiveTab('s=overview_villages&m=8')) {

				/* FUNCTIONALITY
				 * enables the user to batch research units
				 * one-click easyness
				 */

				var getResearchSession = function(villageId) {
					var session;
					$.ajax({
						type: 'get',
						async: false,
						url: '/game.php?village=' + villageId + '&s=build_barracks&m=research' + av,
						success: function (data) {
							var p = $(data).find('a[href*="a=research"]:first').attr('href');
							if (p) {
								session = p.substring(p.indexOf('a=research&p=') + 13, p.indexOf('&unit='));
							}
						}
					});
					return session;
				};

				//* add UI
				$('.contentpane .borderlist').eq(1).find('th').parent().before('<tr><td colspan="13"><span id="kes_research" class="click">' + l.researchMissingTroops + '</span></td></tr>');

				//* add event handling
				$('#kes_research').click(function () {

					$(this).text(l.beingProcessed + '...').css({color: 'crimson', 'font-weight': 'bold'});

					//* data array
					var research = [], session;
					//* loop trough setts, collect data and research by click
					$('.contentpane .borderlist').eq(1).find('img[src*="grey.png"]').parent().parent().each(function (i) {
						//* loop of all tr's with a grey dot
						var research_units = ['farmer', 'sword', 'spear', 'axe', 'bow', 'spy', 'light', 'heavy', 'ram', 'kata', 'snob'],
							current = $(this),
							last = current.find('td:last');

						//* get village
						var villageId = current.find('td:first').find('a').attr('href');
							villageId = villageId.substring(villageId.indexOf('village=') + 8, villageId.indexOf('&s=build_barracks'));

						//* now search for units that need research
						current.find('td:gt(0):lt(10)').each(function (i) {
							if ($(this).find('img[src*="grey.png"]').length) {
								if (last.find('img[src*="unit_' + research_units[i] + '"]').length === 0) {

									if(typeof session === 'undefined') {
										session = getResearchSession(villageId);
									}

									var researchLink = '/game.php?village=' + villageId + '&s=build_barracks&m=research&a=research&p=' + session + '&unit=' + research_units[i] + av;
									research.push(researchLink);
								}
							}
						});
					});

					if (research.length > 0) {

						// cycle missing units
						(function makeResearch(queue) {
							$.ajax({
								type: 'post',
								url: queue.shift(),
								success: function() {
									if(queue.length > 0) {
										makeResearch(queue);
									} else {
										var page = Query.start;
										page = (typeof page === 'undefined') ? '' : '&start=' + page;
										//* reload when finished
										$.ajax({
											type: 'post',
											url: '/game.php?s=overview_villages&m=8' + page + av,
											success: function (data) {
												var table = $(data).find('.contentpane .borderlist').eq(1);
												$('.contentpane .borderlist').eq(1).replaceWith(table);
												window.alert(l.researchStarted);
											}
										});
									}
								}
							});
						})(research);

					} else {
						$(this).replaceWith(l.noMissingResearch);
						window.alert(l.noMissingResearch);
					}
				});
			} else if (page.match('m=4&type=away_detail')) {
				/* FUNCTIONALITY
				 * enables the user to batch select support in one settlement
				 * save selection over page change
				 */

				var selection = [];
				$('table[class*="borderlist"]').eq(3).find('input[type="checkbox"]').parent().parent().each(function () {
					var villageId = $(this).find('td:first').find('a').attr('href');
					villageId = villageId.substring(villageId.lastIndexOf('=') + 1);
					$(this).find('td:first').attr('colspan', '1').after('<td class="marked_group"><span class="click removeall" villageId="' + villageId + '">' + l.all + '</span></td>');
				});
				if ($.kes('isKey', 'kes_selection')) {
					$('td[colspan*="14"]').append(' <span id="kes_loadSelection" class="click kes_mark">' + l.markSelection + '</span>');
					selection = $.kes('loadKey', 'kes_selection');

					$('#kes_loadSelection').bind('click', function () {
						for (var i in selection) {
							if (selection.hasOwnProperty(i)) {
								$('table[class*="borderlist"]').eq(3).find('td[class*="marked_group"]').parent().find('td:first > a[href*="' + selection[i] + '"]').each(function () {
									$(this).siblings('input').attr('checked', 'true');
									$(this).parent().parent().find('td[class*="marked_group"]').eq(1).find('span').removeClass('click removeall');
								});
							}
						}
					});

					$('td[colspan*="14"]').append(' <span id="kes_deleteSelection" class="click kes_mark">' + l.deleteSelection + '</span>');
					$('#kes_deleteSelection').bind('click', function () {
						$.kes('deleteKey', 'kes_selection');
						$('#kes_loadSelection, #kes_deleteSelection').kes('fadeOutRemove');
					});
				}

				$('span[class*="removeall"]').bind('click', function () {
					var villageId = $(this).attr('villageId');
					$('table[class*="borderlist"]').eq(3).find('td[class*="marked_group"]').parent().find('td:first > a[href*="' + villageId + '"]').each(function () {
						$(this).siblings('input').attr('checked', 'true');
						$(this).parent().parent().find('td[class*="marked_group"]').eq(1).find('span').removeClass('click removeall');
					});
					selection.push(villageId);
				});

				//* save selection over page change
				$('td[colspan*="14"]:first > a, td[colspan*="14"]:first > input, input[value*="' + l.retrieve + '"]').bind('click', function () {
					if (selection.length != 0) {
						$.kes('saveKey', selection);
					}
				});
			} else if(k.modul.sortOwnAttacks && identifyActiveTab('s=overview_villages&m=5&type=attack')) {

				var table = $('.borderlist').eq(3);

				var button = $('<input type="submit" id="kes_sort_attack_overview_submit" value="' + l.modul.sortOwnAttacks + '">');
				table.before(button);

				button.click(function() {

					$(this).remove();

					var isPaginated = (table.find('tr:first > td').prop('colspan') == 14),
						bounds 		= (isPaginated) ? 2 : 1,
						head		= table.find('th:first').parent();
					var rows  		= table.find('tr:gt(' + (bounds - 1) +')');
						rows 		= rows.slice(0, -(bounds));

					rows.map(function(i, element) {
						var href = $(this).find('td:first').find('a').prop('href'),
							id = 'jump_' + $.kes('getUrlParameters', href)['id'];

						return $(element).prop('id', id);
					});

					var sort_by_coordinates = function(a, b) {

						var make_a = $(a).find('td').eq(1).find('a').eq(1).html();
						var make_b = $(b).find('td').eq(1).find('a').eq(1).html();

						var xya = make_a.split('|'), xyb = make_b.split('|');

						return (xya[0]+xya[1]) - (xyb[0]+xyb[1]);
					};

                    // TODO figure out why sorting doesnt work in chrome seems to do too much ... ?
					var sorted = rows.sort(sort_by_coordinates);

					rows.remove();
					table.find('tr').eq(bounds-1).after(sorted);

					var create_overview = function(sorted) {
						var object = {}, result = '';
						sorted.each(function() {
							var td 			= $(this).find('td');
							var target  	= td.eq(1).find('a').eq(1).html(),
								link		= td.eq(1).html(),
								barracks 	= td.eq(2).find('a').prop('href'),
								arrival 	= td.eq(3).text();

							var	jump 		= '#' + $(this).prop('id'),
								isSnob		= (td.eq(14).text() != 0);

                            if(!object[target]) {
								object[target] = {
									'count' : 1,
									'snob'	: (isSnob) ? 1 : 0,
									'snobf' : (isSnob) ? arrival : '',
									'snobj' : (isSnob) ? jump : '',
									'link'  : link,
									// first attack
									'first' : arrival,
									'flink' : barracks,
									'fjump' : jump,
									// last attack
									'last'	: arrival,
									'llink' : barracks
								};
							} else {
								object[target]['count'] += 1;

								if(isSnob) {
									object[target]['snob'] += 1;
									if(object[target]['snobf'] == '') {
										object[target]['snobf'] = arrival;
										object[target]['snobj'] = jump;
									}
								}

								object[target]['last'] = arrival;
								object[target]['llink'] = barracks;
							}
						});

						// build html
						for(var target in object) {
							if(object.hasOwnProperty(target)) {
								var snob = (object[target]['snob'] != 0) ? ' (<a class="jump" data-href="' + object[target]['snobj'] + '" href="' + object[target]['snobj'] + '" title="' + object[target]['snobf'] + '">' + object[target]['snob'] + '</a>)' : '';
								result += '<tr><td>' + object[target]['link'] + '</td><td><span class="count">' + object[target]['count'] + '</span>' + snob + '</td><td><a data-href="' + object[target]['flink'] + '" href="' + object[target]['flink'] + '" target="_blank">' + object[target]['first'] + '</a> (<a  class="jump" data-href="' + object[target]['fjump'] + '" href="' + object[target]['fjump'] + '">' + l.goto + '</a>)</td><td><a href="' + object[target]['llink'] + '" target="_blank">' + object[target]['last'] + '</a></td></tr>';
							}
						}

						return result;
					};

					if($('#kes_sort_attack_overview').length == 0) {
						table.before('<table class="borderlist" style="width:820px;" id="kes_sort_attack_overview"><tr><th>' + l.target + '</th><th>' + l.amount + '</th><th>' + l.arrival + '</th><th>' + l.arrival + '</th></tr></table><br />');
					} else {
						$('#kes_sort_attack_overview').find('tr:gt(1)').remove();
					}

					$('#kes_sort_attack_overview').append(create_overview(sorted))
						.on('click', '.jump', function() {

							var row 	= $(this).closest('tr'),
								first 	= row.find('.jump:last').data('href'),
								amount  = row.find('.count').text();

							table.find('td.kes_used').removeClass('kes_used');
							$(first).prev().nextAll('tr:lt(' + amount + ')').find('td').addClass('kes_used');

						});

				});

			} else if (identifyActiveTab('s=overview_villages&m=6')) {

				displayAttacksWithSeconds(3);

				// runtimecalc for left flag
				if(k.modul.insertIntoRuntimeCalc) {

					var row = $('table.borderlist').eq(3).find('tr > td').parent();

					row.each(function() {
						var cur = $(this);
						if (cur.find('td[class*="list"]')) {
							var children = cur.children();
							var data	 = '&target=' + children.eq(2).find('a:last').html() + '&source=' + children.eq(1).find('a:last').html() + '&time=' + children.eq(4).find('span').attr('time') + '&starttime=' + new Date().getTime();
							//* add link to runtimecalc
							children.eq(0).find('img:first').wrap('<a target="_blank" href="game.php?&s=tools&m=runtime_calculator' + data + av + '">');
						}
					});

				}

				// ignore attacks via flag
				if(identifyActiveTab('m=6&type=notignored')) {

					// find pagination
					$('table.borderlist').eq(3).find('tr > td[colspan]').addClass('kes_pagination');

					// setting up ui
					var table = $('table.borderlist').eq(3).find('tr > td:not(.kes_pagination)');

					table.parent().each(function() {
						var t = $(this).find('td').eq(0),
							attId = '',
							id = $(this).find('td').eq(1).find('a').attr('href');

							attId = $.kes('getUrlParameters', t.find('a').attr('href'))['id'];
							id = $.kes('getUrlParameters', id)['id'];

						t.find('a').eq(0).before('<input type="checkbox" class="kes_help_ignore" data-sid="' + id + '" value="' + attId + '">');
					});
					table.parent().parent().append('<tr><th colspan="3"><input type="checkbox" class="kes_help_ignore" id="kes_ignore_all"> ' + l.selectAll +'</th><td colspan="2"><input id="kes_ignore_submit" type="submit" value="' + l.ignore +'"></td></tr>');

					// event handling
					$('#kes_ignore_all').click(function() {
						$('.kes_help_ignore').prop('checked', $(this).prop('checked'));
					});
					$('#kes_ignore_submit').click(function() {
						var checked = $('.kes_help_ignore:checked').length;
						if(checked) {
							// loading animation
							$('#kes_ignore_submit').after(' <div class="kes_spinner"></div>');

							var ignore = {};
							$('.kes_help_ignore:checked').each(function() {
								var t = $(this),
									id = t.data('sid'),
									attId = t.val();

								if(!ignore[id]) {
									ignore[id] = [];
								}

								ignore[id].push(attId);
							});

							var villageId = table.find('.kes_help_ignore:first').data('sid'),
								url = 'game.php?village=' + villageId + '&s=build_barracks&m=command' + av;


							$.when($.kes('getSession', url)).then(function(raw) {
								var session = $.kes('getUrlParameters', $(raw).find('form[name="ignore"]').attr('action'))['p'],
									ignoreUrl = 'game.php?village=kes_ignore_placeholder&s=build_barracks&m=command&a=setTroopIgnore&p=' + session + av;

								for(var sett in ignore) {
									if(ignore.hasOwnProperty(sett)) {
										$.kes('queue', {
											type: 'post',
											url: ignoreUrl.replace('kes_ignore_placeholder', sett),
											data: 'ignore[]=' + ignore[sett].join('&ignore[]=')
										});
									}
								}
							});
						}


					});

				}

			} else if (identifyActiveTab('s=overview_villages&m=9')) {

				/* FUNCTIONALITY
				 * enables the user to set/alter groups for villages on the same page
				 * i.e without having to load the popup
				 */

				var formGenerator = function(markedGroups, groups, villageId) {
					var formAction = 'popup.php?s=groups&m=village&inta=modifyVillageGroups&village_id='+ villageId + av,
						html = arrow + ' <span class="click kes_multiselect_opener"><span class="kes_multiselect_count">' + markedGroups.length + '</span> ' + l.selectedGroups + '</span> <span class="kes_multiselect_status" style="display: none"></span><br />';

					html += '<div class="kes_multiselect"><form action=' + formAction + ' method="POST">';

					for(var g in groups) {
						if (groups.hasOwnProperty(g)) {
							var checkStatus = (markedGroups.indexOf(groups[g].name) != -1 ) ? 'checked="checked"' : '';
							html += '<input type="checkbox" class="checkbox" ' + checkStatus + ' name="vg[]" value="' + groups[g].id + '"><span>' + groups[g].name + '</span><br />';
						}
					}
					return html += '</form></div>';
				};

				var submitForm = function(div) {
					$.ajax({
						type: 'post',
						url: div.find('form').attr('action'),
						data: div.find('form').serialize(),
						success: function () {
							div.siblings('.kes_multiselect_status').css({color: 'green'}).text(l.saved).kes('fadeInfadeOut');
						}
					});
				};

				//toggle form div and submit on close
				$('.kes_multiselect_opener').live('click', function () {
					var div = $(this).siblings('div.kes_multiselect');

					$('div.kes_multiselect_open').each(function () {
						$(this).removeClass('kes_multiselect_open');
					});
					div.toggleClass('kes_multiselect_open');
				});

				//count on change
				$('.checkbox').live('change', function () {
					var form 	 = $(this).parent(),
						count 	 = form.find('.checkbox:checked').length,
						siblings = form.parent().parent().siblings();

					submitForm(form.parent());
					// alter count
					form.parent().siblings('span.click').find('.kes_multiselect_count').text(count);
					siblings.eq(1).text(count);
					//alter group display
					siblings.eq(2).html('<div style="width: 200px;">' + $.map(form.find('.checkbox:checked').next('span'), function (element) { return $(element).text(); }).join('; ') + '</div>');
				});

				$(document).ready(function () {

					var tableCache 		= $('table.borderlist').eq(3),
						firstVillageId 	= tableCache.find('tr > td:first').find('a').attr('href');
						firstVillageId 	= firstVillageId.substring(firstVillageId.indexOf('village=') + 8, firstVillageId.indexOf('&s=overview_villages'));
					var groups 			= $.kes('getGroups', firstVillageId);

					tableCache.find('tr > th').parent().find('th:last').css({ width: 'auto' }).end().find('th:eq(2)').css({ width: '200px' });

					var doubleCache 	  = tableCache.find('tr > td').parent().find('td:eq(3)'),
						doubleCacheLength = doubleCache.length,
						stepSize 		  = 100,
						steps 			  = Math.ceil(doubleCacheLength / stepSize),
						step 			  = 0;

					function lazyManipulate(doubleCache) {
						// depending on the amount of settlements it can be very expensive to manipulate all cells "at once" so I built a buffer that delays the manipulation
						doubleCache.slice(step, step + stepSize).each(function () {
							var parent 		 = $(this).parent(),
								markedGroups = parent.find('td:eq(2)');
								markedGroups = (markedGroups.find('span.notice').length == 1) ? [] : $(this).parent().find('td:eq(2)').text().trim().split("; ");

							var villageId 	 = parent.find('td:eq(0)').find('a').attr('href');
								villageId 	 = villageId.substring(villageId.indexOf('village=') + 8, villageId.indexOf('&s=overview'));

							$(this).replaceWith('<td>' + formGenerator(markedGroups, groups, villageId) + '</td>');
						});

						step = step + stepSize;
						steps--;
						if (steps > 0) {
							setTimeout(function () { lazyManipulate(doubleCache); }, 50);
						}
					}
					lazyManipulate(doubleCache);
				});
			}
		}
	};
}(kes));
