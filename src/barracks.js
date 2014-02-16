css += '.kes_toggle_sim { cursor: pointer; width: 25px; text-align: center; }';

(function(kes) {
	kes.module.barracks = {
		matcher: page.match('s=build_barracks'),
		fn: function() {
			/* FUNCTIONALITY
			 * on send choose target for kata
			 * handle x,y input fields (empty if values are 0 on focus, set values 0 if empty on focusout)
			 * add insertAll Button for classic and modern view
			 * add trooplinks if enabled
			 */

			if (identifyActiveTab('&m=command')) {

				if (page.match('sub=send')) {

					$('select[name*="kata_target"]').val(k.kata_select);

				} else {

					function fillInUnits(troops) {
						for(var unit in unit_runtime) {
							if (unit_runtime.hasOwnProperty(unit)) {
								var avail = $('input[name="' + unit +'"]').siblings('span').html().replace(/[\(\)\.]/g, "");
								$('input[name="' + unit + '"]').val((parseInt10(troops[unit]) < parseInt10(avail)) ? troops[unit] : avail);
							}
						}
					}

					function insertAll(elem) {
						elem.each(function() {
							$(this).prev('input').val( $(this).text().replace(/[\(\)\.]/g, "") );
						});
					}

					//* empty send fields when zero, fill in zeros on focusout
					$('input[id*="send_"]').focusin(function () {
						if ($('#send_x, #send_y').val() == 0) { $('input[id*="send_"]').val(''); }
					}).focusout(function () {
						if ($('#send_x, #send_y').val() == '') { $('input[id*="send_"]').val('0'); }
					});

					//* is classic view?
					if ($('div[class*="button favourites"]').length == 0) {
						$('td[valign="top"] > span[class="click"]').eq(2).before('<span class="click" id="kes_insertAll">' + arrow + ' ' + l.selectAll + '</span><br />');
						$('#kes_insertAll').bind('click', function () { insertAll($('table[class*="borderlist"]').eq(2).find('td > span')); });
						//* add trooplinks
						if (k.modul.trooplinks) { $('table.borderlist').eq(2).after(displayTrooplinks()); }
					//* is modern view!
					} else {
						$('div[class*="boxOptions"]').append('<div class="awesome-button" style="left: 409px; position: absolute; test-align: center; top: 90px;  width: 120px; text-align:center;"><span style="color: #FCD87E;" id="kes_insertAll">' + l.selectAll + '</span></div>');
						$('#kes_insertAll').bind('click', function () { insertAll($('div[class*="quantity"] > span')); });
						//* add trooplinks
						if (k.modul.trooplinks) { $('div.boxOptions').before(displayTrooplinks()); }
					}
					//* when clicked extract id (one, two, three) and fill in the units chosen in the settings
					$('span.kes_mark').click(function () {
						var number = $(this).attr('id');
						fillInUnits(k.trooplinks[number.substring(number.indexOf('kes_trooplink_') + 14)]);
					});
				}
			} else if (k.modul.massdisband && page.match('m=massdisband')) {
				/* FUNCTIONALITY
				 * replaces the original massdisband with one that only runs in 'cut of the top' mode
				 */

				$(document).ready(function () {
					//* replace kingsage button with kes button
					$('input[id*="fillOutButton"]').replaceWith('<input id="kes_disband" type="submit" value="(kes) ' + l.fillIn + '">');
					$('input#kes_disband').click(function () {
						//* collect data for wanted units
						var wanted_units = [];
						$('form#groupFilloutOption > table').find('input[id*="group"]').each(function () {
							var unit = $(this).attr('id').replace('group-', '');
							wanted_units[unit] = $(this).val();
						});
						//* fill in form fields;
						$('table#massDisbandTable > tbody > tr').each(function () {
							$(this).find('td > span[class*="click"]').parent().each(function () {
								var elem = $(this).find('input[id*="amount_"]');
								var unit = $(elem).attr('id');
									unit = unit.substring(unit.indexOf('_') +1 , unit.lastIndexOf('_'));
								var amount = $(elem).attr('value');
								if (parseInt10(amount) > parseInt10(wanted_units[unit])) {
									$(this).find('input[id*="disband_"]').val(parseInt10(amount) - parseInt10(wanted_units[unit]));
								}
							});
						});
					});
				});
			} else if (identifyActiveTab('&type=sim_battle')) {
				/* FUNCTIONALITY
				 * display long numbers
				 * toggles unit/res view
				 */

				var cell = $('form[name="kingsage"] > table.borderlist > tbody > tr:last');
				var cellText = cell.find('td:first').text();
				var minus25 = '<span id="minus25" class="click">-25%</span>';
				var plus25 = '<span id="plus25" class="click">+25%</span>';
				cell.find('td:first').html(cellText.replace('-25%', minus25).replace('+25', plus25));

				//add click handler
				$('#minus25, #plus25').click(function () {
					var rel = $(this).html().replace('%', '');
					cell.find('td:last > input').val(rel);
				});

				if (k.modul.simulator && page.match('inta=battle')) {
					//* add switch to toggle units / res views
					$('table.borderlist').slice(1, 4).find('tr:first').prepend('<td class="kes_toggle_sim" rowspan="4">&raquo;</td>');

					//* replace short version (10k etc.) with long numbers
					$('table.borderlist').slice(1, 4).find('tr').each(function () {
						$(this).find('td > span, th > img').each(function () {
							$(this).parent().addClass('kes_toggle');
							var unit_long = $(this).attr('title');
							if (unit_long) {
								unit_long = unit_long.substring(0, unit_long.indexOf(' '));
								$(this).html(unit_long);
							}
						});
						//* hide resources/settlers
						$(this).find('th:gt(11), td:gt(11)').css('display', 'none').addClass('k_toggle').removeClass('kes_toggle');
					});

					//* highlight on hover & bind click events
					$('.kes_toggle_sim').hover(function () { $(this).addClass('marked'); },function () { $(this).removeClass('marked'); });
					$('.kes_toggle_sim').bind('click', function () { $('.kes_toggle, .k_toggle').toggle(); });
				}
			}
		}
	};
}(kes));
