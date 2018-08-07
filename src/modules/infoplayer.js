css += 'tr.kes_selected td { background: url("img/layout/bg_table_cell_marked2.jpg") repeat-x scroll 0 0 transparent !important; }';
css += '.unselectable { user-select: none; -moz-user-select: none; -khtml-user-select: none; }';
css += '.kes_remove_selection { display: inline; background-color: #fff; cursor: pointer; position: relative; float: right; z-index: 150; color: crimson; font-weight: bold; }';
css += '#kes_showSelectedSetts { position: fixed; background: #FFF; font-size: 10pt; border-radius: 5px; padding: 5px; z-index: 200; top: 10%; left: 50%; margin-left: -310px; width: 620px; max-height: 85%; overflow-y: auto; }';


(function(kes) {
	kes.module.infoplayer = {
		matcher: page.match('s=info_player') && !(page.match('m=statistics') || page.match('m=conquers')),
		fn: function() {
			/* FUNCTIONALITY
			 * add bbCodeExport and sorting functionality to settlements
			 * basically lets you post into board via ajax
			 * also calculates how well the player has used their available trooppoints
			 */

			//* tags for bbCodeExport
			var post_details 			= { settlementName: 'kes_settname', nick: 'kes_player', village: 'kes_coords', continent: 'kes_continent', points: 'kes_points' };
				post_details.std_input  = post_details.village;

			if (k.modul.bbCodeExport) {

				$('table.borderlist').eq(3).prepend('<tr><th colspan="3"><span class="click" id="kes_enablebbCodeExport">' + arrow +' (kes) ' + l.enableBBCodeExport + '</span></th></tr>');
				$('#kes_enablebbCodeExport').bind('click', function () {
					$(this).parent().parent().replaceWith('<tr><th colspan="3">' + l.exportBBCode + '</td></tr><tr><td id="kes_threadId_avail" colspan="3"></td></tr><tr><td colspan="2">\
					<input type="radio" value="kontinent" name="kes_sel_setts"><span style="vertical-align: bottom; display: inline-block; width: 100px;">' + l.sortContinent + '</span>\
					<input type="radio" value="koords" name="kes_sel_setts" checked="checked"><span style="vertical-align:bottom">' + l.sortCoords + '</span></td><td></td></tr><td colspan="2">\
					<input type="radio" value="points" name="kes_sel_setts"><span style="vertical-align: bottom; display: inline-block; width: 100px">' + l.sortPoints + '</span>\
					<input type="radio" value="name" name="kes_sel_setts"><span style="vertical-align: bottom">' + l.sortName + '</span></td><td><input type="submit" id="kes_sel_setts_submit" value="' + l.bbCode + '"></td></tr>\
					<tr><td colspan="3"><span class="click kes_mark" id="kes_select_all">' + arrow + ' ' + l.selectAll + '</span> <span class="click kes_mark" id="kes_deselect_all">' + arrow + ' ' + l.deselectAll + '</span></td></tr>');

					function getKontinent (koords) { return koords.substring(4,5)+koords.substring(0,1); }
					//* prepend controls
					$('table.borderlist').eq(3).prepend('');
					//* make table unselectable
					$('table.borderlist').eq(3).addClass('unselectable');
					//* write msg whether thread was selected or not
					if ($.kes('isKey', 'kes_thread')) {
						var thread 		= $.kes('loadKey', 'kes_thread'),
							threadName  = thread.name;
						$('#kes_threadId_avail').html('<span style="color: green; font-weight: bold;">' + l.thread + ' "' + threadName + '" ' + l.selected + '.</span>');
					} else {
						$('#kes_threadId_avail').html('<span style="color: crimson; font-weight: bold;">' + l.goChooseThread + '.</span>');
					}

					$(document).ready(function () {
						$.fn.selectSettlement = function () {
							if (!$(this).hasClass('kes_selected')) {
								$(this).addClass('kes_selected').find('td:first').find('a, img').css('float', 'left').end().append('<div class="kes_remove_selection"><div style="position: absolute; right: 0;">' + l.deselect + '</div></div>');
							}
						};
						var selectable = false;
						// handle selecting
						$('table.borderlist').eq(3).find('tr:gt(5)')
							.mousedown(function (){ selectable = true; })
								.mouseup(function (){ selectable = false; })
									.mousemove(function () { if (selectable) { $(this).selectSettlement(); } })
										.click(function () { $(this).selectSettlement(); });
						//* deselect handler
						$('.kes_remove_selection').live('click', function () {
							$(this).parent().parent().removeClass('kes_selected').end().end().fadeOut().remove();
						});
					});
					//* select deselect all handlers
					$('#kes_select_all').bind('click', function () { $(this).fadeOut().fadeIn(); $('table.borderlist').eq(3).find('tr:gt(5)').each(function () { $(this).selectSettlement(); }); });
					$('#kes_deselect_all').bind('click', function () { $(this).fadeOut().fadeIn(); $('table.borderlist').eq(3).find('tr:gt(5)').each(function () { $(this).removeClass('kes_selected').find('td:first > div').remove(); }); }).fadeOut().fadeIn();
					//* sort data eventually push to board
					$('#kes_sel_setts_submit').bind('click', function () {
						if ($.kes('isKey', 'kes_thread')) {
							//* collect data
							var thread 	   = $.kes('loadKey', 'kes_thread'),
								threadName = thread.name, mode = $('input[name="kes_sel_setts"]:checked').val(),
								threadId   = thread.id;
								playerName = $('table.borderlist').eq(2).find('tr:first').text().trim();
								playerName = playerName.substring(playerName.indexOf(':') + 1);
								playerName = $.trim(playerName);
							var setts = [];
							$('table.borderlist').eq(3).find('tr.kes_selected').each(function () {
								var settlementName = $(this).find('td:first > a').html(),
									xy = $(this).find('td:nth-child(2) > a').html(),
									x = parseInt10(xy.split('|')[0]), y = parseInt10(xy.split('|')[1]),
									k = getKontinent(xy), p = $(this).find('td:nth-child(3)').html();
									p = p.replace(/\./g, '');
								setts.push({pos: x + '|' + y, continent: k, points: p, sett: settlementName, nick: playerName});
							});

							var formatOutput = function(sett, r) {
								var o = r;
								o = o.replace(new RegExp('{' + post_details.nick		   + '}', 'g'), ' ' + sett.nick);
								o = o.replace(new RegExp('{' + post_details.settlementName + '}', 'g'), ' ' + sett.sett);
								o = o.replace(new RegExp('{' + post_details.village		+ '}', 'g'), ' [village]' + sett.pos + '[/village]');
								o = o.replace(new RegExp('{' + post_details.continent	  + '}', 'g'), ' K' + sett.continent);
								o = o.replace(new RegExp('{' + post_details.points		 + '}', 'g'), ' ' + sett.points);
								return o;
							};

							var confirmPost = function(setts, playerName, threadName, threadId, settsPerPosts) {
								var postCount = Math.ceil(setts.length/parseInt(settsPerPosts, 10));
								//* settlement count, post count, playername, threadname, threadId submit button to click
								$('body').append('<div id="kes_overlay" class="kes-backlight" style="display: block !important;"><h3 style="color: white; text-align:left; opacity: 1; margin: 1em;">' + l.close + '</h3></div>\
										<div id="kes_showSelectedSetts">\
											<div style="line-height: 1.1; text-align: left; width: 50%; margin: 0; float: left; border-right: 1px solid #DDD;">\
												<h3>' + l.summary + ':</h3>\
												' + l.postIn + ' "' + threadName +'" (<a href="/forum.php?s=forum_thread&thread_id=' + threadId + av + '" target="_blank">' + threadId + '</a>)<br /> ' + l.player + ': ' + playerName + '<br />\
												' + l.amountOfSetts + ': ' + setts.length + '<br />' + printf(l.postsToBeCreated, postCount) + '<br /><br />\
												<h3>' + l.formatting + ':</h3>\
												<h4>' + l.header + ':</h4><textarea style="min-width: 290px; max-width: 290px; min-height: 60px; max-height: 60px;" id="kes_post_top"></textarea>\
												<h4>' + l.settlementDisplay + ':</h4>\
												<span class="kes_input click">{' + post_details.nick + '}</span>, <span class="kes_input click">{' + post_details.settlementName + '}</span>, <span class="kes_input click">{' + post_details.village + '}</span>, \
												<span class="kes_input click">{' + post_details.continent + '}</span>, <span class="kes_input click">{' + post_details.points + '}</span><br />\
												<textarea style="min-width: 297px; max-width: 297px; min-height: 90px; max-height: 90px;" id="kes_post_body">{' + post_details.std_input +'}</textarea>\
												<h4>' + l.footer + ':</h4><textarea style="min-width: 290px; max-width: 290px;min-height: 60px; max-height: 60px; height: 60px;" id="kes_post_footer"></textarea>\
												<input id="confirm_post_submit" type="submit" value="' + l.confirm + '">\
											</div>\
											<div style="line-height: 1.1; text-align: left; padding-left: 3px; width: 49%; margin: 0; float: right;">\
											<h3>' + l.preview + ':</h3><span id="kes_post_preview"></span>\
											</div></div>');
								// update preview on change
								function updatePreview() {
									$('#kes_post_preview').html($('#kes_post_top').val() + '<br />' + formatOutput({pos: 'xxx|yyy', continent: 'YX', points: '10000', sett: l.settlement, nick: l.player}, $('#kes_post_body').val()) + '<br />[...]<br />' + $('#kes_post_footer').val());
								}
								updatePreview();
								$('.kes_input').bind('click', function () { $('#kes_post_body').val($('#kes_post_body').val() + $(this).html()); updatePreview(); });
								$('textarea[id*="kes_post_"]').keyup(function () {
									updatePreview();
								});
								$('.kes-backlight').bind('click', function () { $('.kes-backlight, #kes_showSelectedSetts').fadeOut().remove(); $('.kes_input').unbind('click'); });
								$('#confirm_post_submit').bind('click', function () {
									var top	= $('#kes_post_top').val(),
										format = $('#kes_post_body').val(),
										footer = $('#kes_post_footer').val(),
										output = top + '\n' + playerName + '\n',
										count  = 0,
										data   = [];
									for(var i = 0; i < setts.length; i++) {
										output += formatOutput(setts[i], format) + '\n';
										count++;
										if (count == settsPerPosts || i == setts.length-1) {
											output += footer;
											data.push(output);
											output = top + '\n' + playerName + '\n';
											count = 0;
										}
									}
									function makePost(threadId) {
										var single = data.shift();
										$.ajax({
											type: 'post',
											url: '/forum.php?s=forum_thread&thread_id=' + threadId + '&a=forumReplyThread' + av,
											data: 'text=' + single,
											complete: function () {
												if (data.length > 0) {
													makePost(threadId);
												}
											}
										});
									}
									makePost(threadId);
									$('.kes_overlay').click();
								});
							};

							var sortKoords = function(a, b) {
								var xya = a.pos.split('|'), xyb = b.pos.split('|');

								a = xya[0]+xya[1];
								b = xyb[0]+xyb[1];

								return a-b;
							};

							var sortKontinents = function(a, b) {
								var xya = a.pos.split('|'), xyb = b.pos.split('|');

								a = (a.continent * 1000) + (xya[0]+xya[1]);
								b = (b.continent * 1000)+ (xyb[0]+xyb[1]);

								return a-b;
							};

							var sortSetts = function(setts, mode) {
								switch(mode) {
									case 'kontinent': return setts.sort(sortKontinents);
									case 'points'   : return setts.sort(function (a, b) { return a.points-b.points; });
									case 'koords'   : return setts.sort(sortKoords);
									default		    : return setts;
								}
							};

							confirmPost(sortSetts(setts, mode), playerName, threadName, threadId, 200);
						} else {
							window.alert(l.chooseThreadFirst + '.');
						}
					});
				});
			}

			var troopScore = calculateTroopScore($('body'));
			//append to cached table
			$('table.borderlist').eq(2).append('<tr><td>' + l.trooppoints + ':</td><td>' + $.kes('prettyNumber', troopScore[0]) + ' (' + ((troopScore[0]/troopScore[1])*100).toFixed(2) + '%)</td></tr>');
		}
	};
}(kes));
