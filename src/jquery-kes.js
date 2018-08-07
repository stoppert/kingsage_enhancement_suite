(function( $ ) {
	//############## PRIVATE HELPER METHODS ##############//
	var privateHelper = {
		encode : (typeof(JSON.stringify) == 'function') ? JSON.stringify : JSON.encode,
		decode : (typeof(JSON.parse) == 'function') ? JSON.parse : JSON.decode,
	};

	var callQueue = [];

	//############## METHODS FOR ALTERING THE DOM ##############//
	var kesForDom = {
		fadeOutRemove: function() {
			return this.each(function() {
				$(this).fadeOut(function() { $(this).remove(); });
			});
		},
		fadeInfadeOut: function() {
			return this.each(function() {
				$(this).fadeIn(function() { $(this).fadeOut(); });
			});
		},
		fadeOutfadeIn: function() {
			return this.each(function() {
				$(this).fadeOut(function() { $(this).fadeIn(); });
			});
		},
		multiCheckBoxes: function(values) {
			return this.each(function(i) {
				$(this).val(values[i]);
			});
		},
		resizeTextarea: function() {
			return this.each(function() {
				var textareaHeight = $(this).prop('scrollHeight'),
					windowHeight = window.innerHeight * 0.9,
					newHeight = (textareaHeight > windowHeight) ? windowHeight : textareaHeight;

					$(this).css({height: newHeight + 'px'});
			});
		},
		nullifyEmptyVal: function() {
			var value = $(this).val();
			return (value === '') ? 0 : value;
		}
	};

	//############## UTILITY METHODS ##############//
	var kesForUtil = {
		//######## SETTINGS ########//
		presets: function() {
			return {
				//* modul on/off
				modul: {
					troopsOnMap				: true,
					marketOptions			: true,
					showAttacksOnMap		: true,
					insertIntoRuntimeCalc	: true,
					highlightgroups			: false,
					massdisband				: true,
					simulator				: true,
					filterOverview			: true,
					bbCodeExport			: true,
					massforward				: true,
					trooplinks				: false,
					targetExport		 	: true,
					massbuild			 	: true,
					setGroupsOnMap			: true,
					sortOwnAttacks			: true
				},
				//* modul end
				kata_select: 'statue',
				spylink_amount: 500,
				units: {
					modul: {
						off: true,
						def: true,
						count: true,
						spy: true
					},
					off: {
						one: { amount: 1, unit:  7 }, two: { amount: 1, unit:  9 },
						color: '#FF8274', abbr: 'O'
					},
					def: {
						one: { amount: 1, unit:  8 }, two: { amount: 1, unit: 12 },
						color: '#98F5FF', abbr: 'D'
					},
					count: {
						one: { amount: 1, unit: 11 }, two: { amount: 1, unit: 12 },
						color: '#FFFAAA', abbr: 'G'
					},
					spy: {
						one: { amount: 1, unit:  5 }, two: { amount: 1, unit: 12 },
						color: '#D15FEE', abbr: 'K'
					}
				},
				market: {
					opt1: {	name:  '10k', option: 'opt1', stone:  10000, wood:  10000, iron:  10000 },
					opt2: { name:  '50k', option: 'opt2', stone:  50000, wood:  50000, iron:  50000 },
					opt3: {	name: '100k', option: 'opt3', stone: 100000, wood: 100000, iron: 100000	},
					opt4: {	name: '200k', option: 'opt4', stone: 200000, wood: 200000, iron: 200000 },
					opt5: {	name: '321k', option: 'opt5', stone: 300000, wood: 100000, iron: 200000 },
					opt6: {	name: '213k', option: 'opt6', stone: 200000, wood: 100000, iron: 300000	},
					d3fault: 'opt4'
				},
				highlightgroups: {
					one: { name: 'a', color: '#004563', group: {} },
					two: { name: 'b', color: '#A90641',	group: {} }
				},
				trooplinks: {
					one: {
						name: 'a', farmer: 0, sword: 0, spear: 0, axe: 0,
						bow: 0,	spy: 0,	light: 0, heavy: 0,	ram: 0,	kata: 0, snob: 0
					},
					two: {
						name: 'b', farmer: 0,	sword: 0, spear: 0,	axe: 0,
						bow: 0,	spy: 0,	light: 0, heavy: 0,	ram: 0,	kata: 0, snob: 0
					},
					three: {
						name: 'c', farmer: 0, sword: 0, spear: 0, axe: 0,
						bow: 0,	spy: 0,	light: 0, heavy: 0, ram: 0, kata: 0, snob: 0
					}
				}
			};
		},
		saveSettings: function(prefix, obj) {
			var save = {};
			for(var i in obj) {
				if (obj[i] instanceof Object) {
					if(prefix.indexOf('highlightgroups') > -1 && i == 'group') {
						var groups = {};
						$('#' + prefix + i + ' input:checked').each(function () {
							var id = $(this).prop('id');
							groups[id] = id;
						});
						save[i] = groups;
					} else {
						save[i] = $.kes('saveSettings', prefix + i + '_', obj[i]);
					}
				} else {
					var elem = $('#' + prefix + i);
					if (elem.is('input[type="checkbox"]')) {
						save[i] = (elem.prop('checked')) ? true : false;
					} else {
						if(i == 'color') {
							save[i] = (isValidColor(elem.val().slice(1))) ? elem.val() : obj[i];
						} else {
							save[i] = elem.val();
						}
					}
				}
			}
			return save;
		},
		//######## UTILITIES ########//
		getUrlParameters: function(url) {
			var query = {}, pair,
				search = url.substring(url.indexOf('?') + 1).split("&"),
			i = search.length;
			while (i--) {
				pair = search[i].split("=");
				query[pair[0]] = decodeURIComponent(pair[1]);
			}
			return query;
		},
		getGroups: function(villageId) {
			var url = '/popup.php?s=groups&m=village&village_id=' + villageId + av;
			var groups = [];
			$.ajax({
				type: 'POST',
				async: false,
				url: url,
				success: function(data) {
					$(data).find('table.borderlist').eq(0).find('tr > td').each(function () {
						var tmpIn = $(this);
						groups.push({ name: tmpIn.text().trim(), id: tmpIn.find('input').attr('value'), checked: (tmpIn.find('input:checked').length == 1) ? true : false });
					});
				}
			});
			return groups;
		},
		getSession: function(url) { // TODO: replace the other session functions
			return $.ajax({
				type: 'post',
				url: url
			});
		},
		genericBBCode: function(creator, data) {
			$('body').append('<div id="kes_box"><textarea style="width: 99%; max-height: 90% !important; resize: none;" id="kes_genericBBCode"></textarea></div><div id="kes_overlay" class="kes-backlight"></div>');

			$('#kes_genericBBCode').text(creator(data));

			$('#kes_overlay').fadeIn().bind('click',function () {
				$('#kes_overlay, #kes_box').kes('fadeOutRemove');
			});
			$('#kes_box').fadeIn();
			$('#kes_genericBBCode').kes('resizeTextarea');
		},
		prettyNumber: function(number) {
			return (number + '').replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
		},
		paddedNumber: function(number) {
			return (parseInt10(number) < 10) ? '0' + number : number;
		},
		prettyTime: function(time) {
			return Math.floor(time / 3600) + ':' + $.kes('paddedNumber', Math.floor((time % 3600) / 60)) + ':' + $.kes('paddedNumber', Math.floor(time % 60));
		},
		queue: function(options) {
			//blindly stolen from http://code.google.com/p/jquery-ajaxq/source/browse/trunk/src/jquery.ajaxq.js

			var optionsCopy = {};
			for (var o in options) {
				if(options.hasOwnProperty(o)) {
					optionsCopy[o] = options[o];
				}
			}
			options = optionsCopy;

			// Override the original callback
			var originalCompleteCallback = options.complete;

			options.complete = function (request, status) {
				// Dequeue the current request
				callQueue.shift();

				// Run the original callback
				if(originalCompleteCallback) {
					originalCompleteCallback(request, status);
				}

				// Run the next request from the queue
				if(callQueue.length > 0) {
					$.ajax(callQueue[0]);
				} else {
					location.reload();
				}
			};

			callQueue.push(options);
			if (callQueue.length == 1) $.ajax(options);
		},
		//######## SAVING/LOADING TO/FROM window.localStorage ########//
		loadKey: function(key) {
			try {
				return privateHelper.decode(window.localStorage.getItem(key));
			} catch(e) {
				return window.localStorage.getItem(key);
			}
		},
		saveKey: function(key, value) {
			return window.localStorage.setItem(key, privateHelper.encode(value));
		},
		deleteKey: function(key) {
			var value = privateHelper.decode(window.localStorage.getItem(key));
			window.localStorage.removeItem(key);
			return value;
		},
		isKey: function(key) {
			return window.localStorage.getItem(key);
		}
	};

	var callKES = function(that, methodArray, method, args) {
		if (methodArray[method]) {
			return methodArray[method].apply( that, args);
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.kes' );
		}
	};

	$.fn.extend({
		kes: function(method) {
			return callKES(this, kesForDom, method, Array.prototype.slice.call( arguments, 1 ));
		}
	});

	$.extend({
		kes: function(method) {
			return callKES(this, kesForUtil, method, Array.prototype.slice.call( arguments, 1 ));
		}
	});
})($);
