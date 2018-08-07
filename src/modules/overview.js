css += '.kes_group_element { display: inline-block; }';

(function(kes) {
	kes.module.overview = {
		matcher: page.match('s=overview') && !page.match('s=overview_villages'),
		fn: function() {

			var place = $('span[onclick*="groups"]').parent(),
				label = $('span[onclick*="groups"]').text() + ': ',
				insert = place.closest('table:not(.noborder)'),
				villageId = Query.village,
				groups = $.kes('getGroups', villageId),
				saveurl = 'popup.php?s=groups&m=village&inta=modifyVillageGroups&village_id=' + villageId + av;

			var formGenerator = function(groups) {
				var currentGroups = [];
				var o = '<br /><table width="790px" class="borderlist"><tr><th>';
					o += label + ' <span id="kes_groups_savestatus" style="color: green; display:none;">' + l.saved + '</span></th></tr><tr><td><form id="kes_groups" action="' + saveurl + '">';
				for(var g in groups) {
					if(groups.hasOwnProperty(g)) {
						var checked = (groups[g].checked) ? 'checked="checked"' : '';
						o += '<span class="kes_group_element"><input name="vg[]" value="' + groups[g].id + '" type="checkbox" ' + checked + '> ' + groups[g].name + ' </span>';
						if(groups[g].checked) {
							// add checked groups to regular group list
							currentGroups.push(groups[g].name);
						}
					}
				}
				o += '</form></td></tr></table><br />';
				if(currentGroups.length > 0) {
					place.text(label + currentGroups.join(', '));
				}
				return (groups.length > 0) ? o : '';
			};

			insert.before(formGenerator(groups));

			$('#kes_groups').delegate('input', 'click', function () {
				var data = $('#kes_groups');
				var newGroups = data.find('input[type="checkbox"]:checked').parent().text();
				$.ajax({
					type: 'POST',
					url: saveurl,
					data: data.serialize(),
					success: function () {
						$('#kes_groups_savestatus').kes('fadeInfadeOut');
						place.text(label + newGroups.replace(/  /g, ', '));
					}
				});
			});
		}
	};
}(kes));
