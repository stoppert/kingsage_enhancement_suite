(function(kes) {
	kes.module.main = {
		matcher: page.match('s=build_main'),
		fn: function() {
			/* FUNCTIONALITY
			 * batch cancelling destruct orders for buildings
			 */

			var destroyText = $('a[href*="m=destroy"]').text(), tableCount = $('table.borderlist'),	isModernView = $('div.mainBuildList, div.mainBuildModern').length;

			if(tableCount.length == (6 - isModernView)) {
				// buildlist available
				var buildList = tableCount.eq(2), destroyList = $.makeArray(buildList.find('tr > td').parent().filter(function() { return $(this).find('td:first').text().match(destroyText); }));
				if(destroyList.length > 0 && destroyText != '') {
					// there are destroy items running
					buildList.before('<span class="click" id="kes_cancelAllDestroy">(kes) ' + l.cancelAllDestroy + '</span><br />'); // LANG
					$('#kes_cancelAllDestroy').bind('click', function() {
						$(this).kes('fadeOutRemove');

						function cancelDestroy(destroyList, callback) {
							var that = $(destroyList.shift()), link = that.find('a[href*="cancelBuilding"]').attr('href');
							$.ajax({
								type: 'post',
								url: link,
								success: function() {
									that.kes('fadeOutRemove');
									if(destroyList.length == 0 && buildList.length == 1) {
										buildList.kes('fadeOutRemove');
									} else {
										callback(destroyList, callback);
									}
								}
							});
						};
						cancelDestroy(destroyList, cancelDestroy);
					});
				}
			}

			if(k.modul.massbuild && premium) {

				$('a[href*="&s=build_main&a=buildBuilding"]').each(function() {
					var current  = $(this),
						row 	 = current.parent().parent(),
						level 	 = parseInt(current.text().match(/\d{1,2}/), 10) - 1 || 0,
						building = current.attr('href');
						building = $.kes('getUrlParameters', building)['build'];

					var modernStyling = (isModernView > 0) ? 'style="color: #F7D48E;" ' : '',
						maximumLevel  = buildCosts.getMaximumLevel( /* building stone wood iron workers */
							buildCosts[building], level, $('#stone').text().replace(".", ""), $('#wood').text().replace(".", ""), $('#iron').text().replace(".", ""), $('a[href*="&s=build_farm"]:first').parent().find('span').text().replace(".", ""));

					var data	= row.find('td'), stone, wood, ore, workers, link;
					if(data.length == 0) {
						// modern views
						stone 	= row.find('.res2'), wood = row.find('.res1'), ore = row.find('.res3'),	workers = row.find('.workers'), link = row.find('.button');
					} else {
						// classic views
						stone 	= data.eq(1), wood = data.eq(2), ore = data.eq(3), workers = data.eq(4), link = data.eq(6);
					}

					stone 	= stone.find('span').text($.kes('prettyNumber', maximumLevel[1]));
					wood	= wood.find('span').text($.kes('prettyNumber', maximumLevel[2]));
					ore		= ore.find('span').text($.kes('prettyNumber', maximumLevel[3]));
					workers	= workers.find('span').text($.kes('prettyNumber', maximumLevel[4]));

					var replacement  = '<a ' + modernStyling + 'href="' + current.attr('href') + '">' + l.buildOne + '</a> ';
						replacement += '<input type="text" maxlength="2" style="width: 17px;" data-max="' + maximumLevel[0] + '" class="kes_buildLevels" value="' + maximumLevel[0] + '"> ';
						replacement += '<span ' + modernStyling + 'class="click kes_massbuild" data-url="' + current.attr('href') + '">' + l.buildMax + '</span>';

						current.replaceWith(replacement);
				});

				$('.contentpane').on('click', '.kes_massbuild', function() {
					var url		= $(this).data('url');
						max		= $(this).siblings('input').data('max'),
						levels 	= $(this).siblings('input').val();
						levels 	= (levels > max) ? max : levels;
					for(var i = 0; i < levels; i++) {
						$.kes('queue', {
							type: 'post',
							url: url,
							success: function(data) {
							 	var content = $(data).find('.contentpane');
								$('.contentpane').replaceWith(content);
							}
						});
					}
				});
			}	
		}
	};
}(kes));
