//* initialize everything as default;
var presets = $.kes('presets');
var k = presets;
//* check for stored user settings and change vars accordingly
if ($.kes('isKey', 'kes_user_settings')) {
	updateSettings();
} else {
	//* this is the first time the script is opened
	putSettings('content_modules');
	//* save presets in advance to prevent this from spawning if the users chooses not to click save
	$.kes('saveKey', 'kes_user_settings', k);
	//* if there is no version make sure, new settings get updated by setting the version to zero
	if (!$.kes('isKey', 'kes_version')) {
		$.kes('saveKey', 'kes_version', '0');
	}
}
