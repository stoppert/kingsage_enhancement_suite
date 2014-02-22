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

				var buildCosts	 = {
					main: 	  {min: 1, max: 50, stone: {b: 	   85, f: 1.17}, wood: {b: 	   70, f: 1.165}, ore: {b: 	   65, f: 1.165}, workers: {b: 	 2, f: 1.12}},
					wood: 	  {min: 0, max: 50, stone: {b: 	   55, f: 1.17}, wood: {b: 	   30, f: 1.165}, ore: {b: 	   40, f: 1.165}, workers: {b: 	 5, f:  1.1}},
					stone: 	  {min: 0, max: 50, stone: {b: 	   40, f: 1.17}, wood: {b: 	   30, f: 1.165}, ore: {b: 	   55, f: 1.165}, workers: {b: 	 5, f:  1.1}},
					iron: 	  {min: 0, max: 50, stone: {b: 	   55, f: 1.17}, wood: {b: 	   40, f: 1.165}, ore: {b: 	   30, f: 1.165}, workers: {b: 	 5, f:  1.1}},
					storage:  {min: 1, max: 50, stone: {b: 	   43, f: 1.17}, wood: {b: 	   40, f: 1.165}, ore: {b: 	   35, f: 1.165}, workers: {b: 0.1, f: 	1.1}},
					hide: 	  {min: 0, max: 30, stone: {b: 	   50, f: 1.17}, wood: {b: 	   40, f: 1.165}, ore: {b: 	   40, f: 1.165}, workers: {b: 	 1, f: 1.15}},
					farm: 	  {min: 1, max: 50, stone: {b: 	   65, f: 1.17}, wood: {b: 	   50, f: 1.165}, ore: {b: 	   50, f:  1.16}, workers: {b: 	 0, f: 	  1}},
					barracks: {min: 0, max: 30, stone: {b: 	  180, f: 1.23}, wood: {b: 	  180, f:  1.21}, ore: {b: 	  120, f:  1.22}, workers: {b: 	 6, f: 1.17}},
					wall: 	  {min: 1, max: 20, stone: {b: 	   60, f: 1.17}, wood: {b: 	   40, f: 1.165}, ore: {b: 	   30, f:  1.16}, workers: {b: 	 4, f: 	1.2}},
					stable:   {min: 0, max: 30, stone: {b: 	  240, f: 1.17}, wood: {b: 	  200, f: 1.165}, ore: {b: 	  220, f:  1.16}, workers: {b:  10, f: 	1.1}},
					market:   {min: 0, max: 30, stone: {b: 	  100, f: 1.17}, wood: {b: 	   80, f: 1.165}, ore: {b: 	   70, f:  1.16}, workers: {b:  10, f: 1.17}},
					garage:   {min: 0, max:  5, stone: {b: 	  400, f: 1.17}, wood: {b: 	  600, f: 1.165}, ore: {b: 	  500, f:  1.16}, workers: {b:  50, f: 	1.4}},
					snob: 	  {min: 0, max: 10, stone: {b:  30000, f:  1.3}, wood: {b:  25000, f: 	1.3}, ore: {b:  25000, f: 	1.3}, workers: {b: 100, f: 	1.2}},
					smith: 	  {min: 0, max:  5, stone: {b:   4000, f:  1.4}, wood: {b: 	 3000, f: 	1.4}, ore: {b:   2500, f: 	1.4}, workers: {b:  25, f: 	1.2}},
					statue:   {min: 0, max:  1, stone: {b: 400000, f: 	 2}, wood: {b: 400000, f: 	  2}, ore: {b: 400000, f: 	  2}, workers: {b: 	 0, f: 1.17}},
					cost: function(building, level) {
						var stone = 0, wood = 0, ore = 0, workers = 0;
						if(typeof level == "number" && level <= building.max && level >= building.min) {
							stone	= Math.round(building.stone.b 	* Math.pow(building.stone.f, level-1)),
							wood	= Math.round(building.wood.b 	* Math.pow(building.wood.f, level-1)),
							ore		= Math.round(building.ore.b		* Math.pow(building.ore.f, level-1)),
							workers	= Math.round(building.workers.b * Math.pow(building.workers.f, level-1));
						}
						return [stone, wood, ore, workers];
					},
					cumulatedCost: function(building, min, max) {
						var stone = 0, wood = 0, ore = 0, workersLow = this.cost(building, min)[3], workersHigh = this.cost(building, max)[3];
						for(var i = min + 1; i <= max; i++) {
							cost = this.cost(building, i);
							stone 	+= cost[0];
							wood	+= cost[1];
							ore		+= cost[2];
						}
						return [stone, wood, ore, workersHigh - workersLow];
					},
					getMaximumLevel: function(building, level, stone, wood, iron, workers) {
						var max 		= building.max,
							min 		= level,
							available 	= [stone, wood, iron, workers],
							canBuild 	= function(cumulated, available) {
								return (cumulated[0] <= available[0] && cumulated[1] <= available[1] && cumulated[2] <= available[2] && cumulated[3] <= available[3]);
							},
							addCost		= function(n, o) {
								return [n[0] + o[0], n[1] + o[1], n[2] + o[2], n[3]];
							};
						//can we build max?
						var maxCost = this.cumulatedCost(building, min, max);
						if(canBuild(maxCost, available)) {
							return [max - min].concat(maxCost);
						} else {
							// search for the max level we can build
							var high 	= max-1,
								low  	= min,
								lowCost = this.cumulatedCost(building, low, low+1),
								lastCost = lowCost;
							for(var i = low + 1; low <= high; i++) {
								var tmpCost = addCost(this.cost(building, i), lastCost);
								if(canBuild(tmpCost, available)) {
									lastCost = tmpCost;
								} else {
									return [i-low].concat(lastCost);
								}
							}
						}
					}
				};

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
