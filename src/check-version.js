//* if it is a newer version update user settings inserting new settings with default values
if (isNewerVersion($.kes('loadKey', 'kes_version'), version)) {
	//* update settings
	function iterateSettings(presets, settings) {
		//* sanitiy check for empty prefix objects
		if(Object.getOwnPropertyNames(presets).length == 0) return settings;

		var new_settings = {};
		for(var i in presets) {
			if (settings.hasOwnProperty(i)) {
				if (presets[i] instanceof Object && !(presets[i] instanceof Array)) {
					new_settings[i] = iterateSettings(presets[i], settings[i]);
				} else {
					new_settings[i] = settings[i];
				}
			} else {
				new_settings[i] = presets[i];
			}
		}
		return new_settings;
	}
	var updated_settings = {};
	if ($.kes('isKey', 'kes_user_settings')) {

		try {
			settings = $.kes('loadKey', 'kes_user_settings');
			updated_settings = iterateSettings(presets, settings);
		} catch(e) {
			window.alert(l.adoptSettings);
			updated_settings = presets;
		}

	} else { updated_settings = presets; }
	//* update user_settings
	$.kes('saveKey', 'kes_user_settings', updated_settings);
	//* update version
	updateSettings();
	$.kes('saveKey', 'kes_version', version);
}
