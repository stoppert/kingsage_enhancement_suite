//* Used to see if the correct tab is active (bg-img equals "s_back")
function identifyActiveTab(link) { return ($('td[background*="s_back"]').find('a[href*="' + link + '"]').length != 0);}

//* Shortcut for parseInt(x,10)
function parseInt10(arg) { return parseInt(arg, 10); }

//* Check if input is a correct hexcolor
function isValidColor(hexcolor) { return (/^([0-9a-f]{1,2}){6}$/i).test(hexcolor); }

//* printf shim for easy string replacement
function printf(string, s) {
	if (s instanceof Array ) {
		var o = string;
		for(var i in s) {
			if (s.hasOwnProperty(i)) {
				o = o.replace('%s', s[i]);
			}
		}
		return o;
	} else {
		return string.replace('%s', s);
	}
}

// calculate trooppoints for every player
function calculateTroopScore(playerPage) {
	var playerPage 	  = $(playerPage);
	var cachedTable   = playerPage.find('table.borderlist').eq(2);
	var totalScore	= cachedTable.find('tr:nth-child(3) > td:last').html().replace(/\./g, "");
	var cities		= cachedTable.find('tr:nth-child(5) > td:last').html().replace(/\./g, "");
	var bonusScore	= (cities-1) * 2250;
	var troopScoremax = cities * 10000;
	var startIndex	= playerPage.find('table.borderlist').eq(3).find('tr > th:last').parent().index();
	var cityScore	 = 0;

	bonusScore = (bonusScore < 0) ? 0 : bonusScore;

	playerPage.find('table.borderlist').eq(3).find('tr:gt(' + startIndex + ')').each(function () {
		cityScore += Number($(this).find('td:last').html().replace(/\./g, ""));
	});
	return [totalScore - (bonusScore + cityScore), troopScoremax];
}

function displayAttacksWithSeconds(element) { // TODO: fix for multipage attacks

	function createDate(time) {
		var date = new Date();
		date.setHours(parseInt10(time[0]));
		date.setMinutes(parseInt10(time[1]));
		date.setSeconds(parseInt10(time[2]));
		return date;
	}

	function formatDate(date, text) {
		var formattedDate = text;
			formattedDate = formattedDate.replace(/\d+\.\d+\./, date.getDate() + '.' + $.kes('paddedNumber', (date.getMonth() + 1)) + '.');
			formattedDate = formattedDate.replace(/[0-9]{2}:[0-9]{2}/, date.getHours() + ':' + $.kes('paddedNumber', date.getMinutes()) + ':' + $.kes('paddedNumber', date.getSeconds()));

		return formattedDate;
	}

	$('table.borderlist').eq(element).find('tr').each(function () {
		var cur = $(this);
		if (cur.find('td:last > span').length > 0) {
			var incomming = cur.find('td:last > span').text().split(':');
			var servertime = createDate($('#servertime').text().split(':'));

			servertime.setSeconds(servertime.getSeconds() + parseInt(incomming[2], 10));
			servertime.setMinutes(servertime.getMinutes() + parseInt(incomming[1], 10));
			servertime.setHours(servertime.getHours() + parseInt(incomming[0], 10));

			var replacable = cur.find('td:nth-child(4)');
			var repl = replacable.text(); // original time left without seconds
			var replacer = formatDate(servertime, repl);

			replacable.text(replacer);
		}
	});
}

//* Filter overdue Attacks for attack display on map
function filterOverdueAttacks(attacks) {
	var tmp_attacks = {};
	$.each(attacks, function (villageId) {
		village_attacks = attacks[villageId];
		tmp_attacks[villageId] = {};
		tmp_attacks[villageId].length = 0;
		for(var index in village_attacks) {
			if (village_attacks.hasOwnProperty(index)) {
				var single_attack = village_attacks[index];
				var time = parseInt10(single_attack[6]) - (Date.parse(new Date()) / 1000);
				if (time > 0) {
					tmp_attacks[villageId].length = index;
					tmp_attacks[villageId][tmp_attacks[villageId].length] = single_attack;
				}
			}
		}
		if (tmp_attacks[villageId].length == 0) {
			delete tmp_attacks[villageId];
		}
	});
	var count = 0;
	for (var item in tmp_attacks) {
		if (tmp_attacks.hasOwnProperty(item)) { count++; }
	}
	if (count == 0) {
		$.kes('deleteKey', 'kes_save_attacks');
	} else {
		$.kes('saveKey', 'kes_save_attacks', tmp_attacks);
	}
}

function displayTrooplinks() {
	var wordToDigit = { one: 1, two: 2, three: 3 };
	var o = '<div style="padding: 5px;"><span style="font-weight: bold;">(kes) ' + l.trooplinks + '</span>';
	for(var no in k.trooplinks) {
		if (k.trooplinks.hasOwnProperty(no)) {
			o += ' <span style="font-weight: bold;">#' + wordToDigit[no] + ' </span><span class="click kes_mark" id="kes_trooplink_' + no + '">' + arrow + ' ' + k.trooplinks[no].name + ' </span> ';
		}
	}
	return o + '</div>';
}

//* Overwrite presets with (existing) user settings
function updateSettings() { k = $.kes('loadKey', 'kes_user_settings'); }

function isNewerVersion(vold, vnew) {
	var o = vold.replace(/\./g, ''), n = vnew.replace(/\./g, '');
	while(o.length != n.length) {
		if (o.length > n.length) { n += '0'; } else { o += '0'; }
	}
	return (parseInt10(n) > parseInt10(o)) ? true : false;
}
