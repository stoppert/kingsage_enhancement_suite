(function(kes) {
	kes.module.attackplaner = {
		matcher: page.match('s=tools&m=attack_planer'),
		fn: function() {
			/* FUNCTIONALITY
			 * handle x,y input fields (empty if values are 0 on focus)
			 */

			$('input[id*="target_"]').focusin(function () {
				if ($('#target_x, #target_y').val() == 0) { $('input[id*="target_"]').val(''); }
			});	
		}
	};
}(kes));
