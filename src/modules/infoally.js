css += '#kes_box { background-color: #fff; display: none; border-radius: 5px; position: fixed; width: 500px; left: 50%; top: 5%; margin-left: -250px; padding: 6px; z-index: 200; }';
css += '.kes_progressOuter { border:1px solid #CFAB65; overflow: hidden; width:100px; height:10px; background: #CFAB65; }';
css += '.kes_progressInner { width: 0px; height: 10px; background: #FFCC6E; }';

(function(kes) {
	kes.module.infoally = {
		matcher: page.match('s=info_ally') && !premium || identifyActiveTab('s=info_ally&m=profile'),
		fn: function() {
			/* FUNCTIONALITY
			 * collect and sort all trooppoints of the alliance's players
			 * also generates bb-code for easy posting into the forum
			 */

			//* set up ui
			var cachedTable = $('table.borderlist').eq(2);
			cachedTable.append('<tr><td colspan="2"><span class="click" id="kes_getAllyTroopPoints">' + l.allyTrooppoints +'</span></td></tr>');

			function getPlayerInfo(members, callback) {
				var href = members.shift();
				$.ajax({
					type: 'POST',
					url: href,
					success: function (data) {
						callback(members, data);
					}
				});
			}

			$('#kes_getAllyTroopPoints').bind('click', function () {
				$(this).unbind('click').fadeOut();

				var membersPage = cachedTable.find('a[href*="info_member"]').attr('href');
				$.when($.ajax({
					type: 'POST',
					url: membersPage
				}).then(function (data) {
					var members = [];
					$(data).find('table.borderlist').eq(2).find('a[href*="info_player"]').each(function () {
						members.push($(this).attr('href'));
					});

					function getAllPlayerInfos(members, callback) {
						var allyTroopPoints = [];
						var len = members.length;
						var left = len;
						var i = 0;

						$('#kes_getAllyTroopPoints').removeClass('click').text(l.loading + ': ' + i +'/'+ len).fadeIn().parent().attr('colspan', 0).after('<td><div class="kes_progressOuter"><div id="kes_progress" class="kes_progressInner" maxwidth="100"></div></div></td>');

						function callQueue(members) {
							getPlayerInfo(members, function (members, playerInfo) {
								var player = [];
								var playerName = $(playerInfo).find('h1').eq(1).text();
									playerName = playerName.substring(playerName.indexOf(' ') + 1);
									playerName = playerName.replace(/\(.*\)/, "").trim();

								player.push(playerName);
								player.push(calculateTroopScore(playerInfo));

								i++;
								$('#kes_getAllyTroopPoints').text(l.loading + ': ' + i +'/'+ len);
								$('#kes_progress').css({'width': i*(100/len) + '%'});

								allyTroopPoints.push(player)
								if (--left === 0) {
									$('#kes_getAllyTroopPoints').parent().parent().remove();
									callback(allyTroopPoints);
								} else {
									callQueue(members);
								}
							});
						}
						callQueue(members);
					};
					getAllPlayerInfos(members, showData);

					function showData(allyTroopPoints) {
						//* sort data according to trooppoints
						allyTroopPoints.sort(function (a,b) { return b[1][0] - a[1][0]; });

						var displayDataAsTable = function(data) {
							var o = '';
							var len = data.length;
							for(var i = 0; i < len; i++) {
								o += '<tr><td>' + data[i][0] + '</td><td>' + $.kes('prettyNumber', data[i][1][0]) + ' (' + ((data[i][1][0]/data[i][1][1])*100).toFixed(2) + '%)';
								if (i != len-1) { o += '</td></tr>'; }
							}
							return o;
						};

						var displayDataAsBBCode = function(data) {

						};

						function getDataReady(lineStart, lineMiddle, lineEnd, data) {
							var o = '';
							var len = data.length;
							for(var i = 0; i < len; i++) {
								o += lineStart + data[i][0] + lineMiddle + $.kes('prettyNumber', data[i][1][0]) + ' (' + ((data[i][1][0]/data[i][1][1])*100).toFixed(2) + '%)';
								if (i != len-1) { o += lineEnd; }
							}
							return o;
						}
						var o = arrow + ' <span class="click" id="kes_createBB">(kes) ' + l.bbCode + '</span><table class="borderlist" style="width: 420px;">';
							o += '<tr><th>' + l.player + '</th><th>' + l.trooppoints + '</th></tr>';
							o += getDataReady('<tr><td>', '</td><td>', '</td></tr>', allyTroopPoints);
							o += '</table><br />';

						$('table.borderlist').eq(3).before(o);
						$('#kes_createBB').bind('click', function () {

							$('body').append('<div id="kes_box"><textarea style="width: 99%; resize: none;" id="kes_data"></textarea></div><div id="kes_overlay"></div>');
							$('#kes_data').text(getDataReady('[player]', '[/player] ', '\n', allyTroopPoints)).select();
							$('#kes_overlay').fadeIn().bind('click',function () {
								$('#kes_overlay, #kes_box').kes('fadeOutRemove');
							});
							$('#kes_box').fadeIn();
							$('#kes_data').kes('resizeTextarea');
						});
					}
				}));
			});
		}
	};
}(kes));
