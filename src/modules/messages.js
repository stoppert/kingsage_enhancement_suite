css += '#bb_code { word-wrap: break-word; overflow-wrap: break-word; }';

(function(kes) {
	kes.module.messages = {
		matcher: page.match('s=messages'),
		fn: function() {
			/* FUNCTIONALITY
			 * multi-selection of items with colors
			 * also lets you mass-forward reports
			 */
			if(page.match('&id')) {

				var returnBBCodeForImage = function(a, match) {
					var type = match.substring(match.lastIndexOf('/') + 1, match.lastIndexOf('.')), result = '';
					if(type.indexOf('res') > -1) {
						switch(type) {
							case 'res2': result = '[img_stone]'; break;
							case 'res1': result = '[img_wood]';  break;
							case 'res3': result = '[img_iron]';  break;
						}
					} else if(type.indexOf('unit') > -1) {
						result = '[img' + type.substring(type.lastIndexOf('_')) + ']';
					} else if(match.indexOf('buildings') > -1) {
						result = '[img_build_' + match.substring(match.lastIndexOf('/') + 1, match.lastIndexOf('.')) + ']';
					} else {
						result = '[img]' + match + '[/img]';
					}
					return result;

				}, regex = new RegExp(/\[img](.*?)\[\/img]/gi);

				var $bbCode = $('#bb_code');

				// ui
				$bbCode.prevAll('.borderlist:first').find('tr:last > td').append(' ' + arrow + ' <span id="kes_report_as_bb_code" class="click">(kes) ' + l.report_as_bb_code + '</span>');

				$('#kes_report_as_bb_code').click(function() {
						var bb = $bbCode.html();
						bb = bb.replace(regex, returnBBCodeForImage);

					$bbCode.html(bb).show();
				});

			} else if(identifyActiveTab('s=messages&m=in')) {

				//* Module CSS
				css += '.kes_padding { padding: 0 5px; }';

				//* multi-all selectors
				$('input[type="checkbox"][name="confbox"]').parent().append(' <span class="click kes_mark kes_padding" rel="reports" toggle="false">' + l.reports + '</span> \
					<span class="click kes_mark kes_padding" rel="mail" toggle="false"><img src="img/messages/mail_read.png"></span> <span class="click kes_mark kes_padding" rel="misc" toggle="false"><img src="img/report/misc.png"></span> <span class="click kes_mark kes_padding" rel="green" toggle="false"><img src="img/dots/green.png"></span>\
					<span class="click kes_mark kes_padding" rel="yellow" toggle="false"><img src="img/dots/yellow.png"></span> <span class="click kes_mark kes_padding" rel="red" toggle="false"><img src="img/dots/red.png"></span> \
					<span class="click kes_mark kes_padding" rel="blue" toggle="false"><img src="img/dots/blue.png"></span> <span class="click kes_mark kes_padding" rel="support" toggle="false"><img src="img/report/support.png"></span>\
					<span class="click kes_mark kes_padding" rel="trade" toggle="false"><img src="img/report/trade.png"></span');

				//* bind clickhandler
				$('.kes_mark').click(function () {
					function selector(rel) {
						switch(rel) {
							case 'reports' 	: return 'img[src*="red"], img[src*="green"],img[src*="blue"],img[src*="yellow"]';
							case 'mail'		: return 'img[src*="mail"]';
							case 'misc'		: return 'img[src*="misc"]';
							case 'red'	 	: return 'img[src*="red"]';
							case 'yellow'  	: return 'img[src*="yellow"]';
							case 'blue'		: return 'img[src*="blue"]';
							case 'green'	: return 'img[src*="green"]';
							case 'support' 	: return 'img[src*="support"]';
							case 'trade'   	: return 'img[src*="trade"]';
						}
					}

					//* lets you toggle the selection
					var toggle = $(this).attr('toggle');
					var selection = $(selector($(this).attr('rel'))).siblings('input[type="checkbox"]');
					if (toggle == 'false') {
						selection.attr('checked', true);
						$(this).attr('toggle', true);
					} else if (toggle == 'true') {
						selection.attr('checked', false);
						$(this).attr('toggle', false);
					}
				});
				if (k.modul.massforward) {

					var forward = function(type, details, nick) {
						var url, data;
						switch(type) {
							case 'report':
								url = 'game.php?s=messages&m=all&a=reportForward&p=' + details.p + '&id=' + details.id;
								data = 'report_to=' + nick;
								break;
							case 'message':
								url = details.url;
								data = 'msg_to=' + nick + '&confbox=on&' + details.data;
								break;
						}
						$.ajax({ type: 'post', url: url + av, data: data	});
					};

					var messageDetails = function(id) {
						return $.ajax({
							type: 'get',
							url: 'game.php?s=messages&m=forward&id=' + id + av,
						}).promise();
					};

					var reportSession = function(id) {
						return $.ajax({
							type: 'post',
							url: 'game.php?s=messages&m=forward_report&id=' + id + av,
						}).promise();
					};

					//* add ui to input a username
					$('table.borderlist').eq(5).append('<tr><td colspan="3"><span style="font-weight:bold;">' + l.recipient + ': </span><input type="text" id="kes_massforward_nick"> <input type="submit" id="kes_massforward" value="(kes) ' + l.forward + '"> <span style="display: none; font-weight: bold;" id="kes_massforward_text"></span></td></tr>');

					//* input handling
					$('#kes_massforward').bind('click', function (event) {
						event.preventDefault();
						var table 		= $('table.borderlist').eq(5),
							reports 	= table.find('img[src*="red"], img[src*="green"],img[src*="blue"],img[src*="yellow"]').siblings('input:checked'),
							messages 	= table.find('img[src*="mail"]').siblings('input:checked'),
							nick 		= $('#kes_massforward_nick').val(),
							session		= '';

						if ((reports.length != 0 || messages.length != 0)&& nick != '') {

							$(reports).each(function () {
								var id = $(this).val();
								if(session == '') session = reportSession(id);

								session.then(function(results) {
									dt = {};
									dt['id'] = id;
									dt['p'] = $.kes('getUrlParameters', $(results).find('form').attr('action'))['p'];
									forward('report', dt, nick);
								});
							});
							$(messages).each(function() {
								var id = $(this).val(),	dt = messageDetails(id);

								dt.then(function(results) {
									var form 	 = $(results).find('form'),
										details  = {};

									details.url  = form.prop('action');
									details.data = form.find('input[type="checkbox"][name="mid[]"]').serialize();
									forward('message', details, nick);
								});
							});

							$('#kes_massforward_text').html(l.forwardSuccess + '.').css('color', 'green').fadeIn(500).delay(800).fadeOut(100);
						} else {
							$('#kes_massforward_text').html(l.forwardError + '!').css('color', 'red').fadeIn(500).delay(800).fadeOut(100);
						}
					});
				}
			}
		}
	};
}(kes));
