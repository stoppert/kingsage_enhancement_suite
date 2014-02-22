(function(kes) {
	kes.module.forum = {
		matcher: k.modul.bbCodeExport && page.match('s=ally&m=forum'),
		fn: function() {
			/* FUNCTIONALITY
			 * add ui for selecting a thread inside the board to post setts into
			 */

			//* create a button to save threadId, threadName;
			$('iframe[src*="forum.php"]').load(function () {
				var iframeURL = $('iframe[src*="forum.php"]').get(0).contentDocument.location.href;
				if (iframeURL.match('s=forum_thread' + av + '&thread_id=')) {
					var frame = $('iframe[src*="forum.php"]').contents();
					$(frame).find('div.smallButton:first').before('<div id="kes_save_thread" class="smallButton"><span style="cursor: pointer;">(kes) ' + l.saveThread + '</span></div>');
					$(frame).find('#kes_save_thread').bind('click', function () {
						$(this).fadeOut().fadeIn();
						var uri = $('iframe[src*="forum.php"]').contents().find('td.headerInfo > a').attr('href')
						var threadId = uri.substring(uri.indexOf('thread_id=') + 10);
						var threadName = $('iframe[src*="forum.php"]').contents().find('td.headerInfo > a').html();
						// sanitize thread id
						if (av != '') {
							threadId = threadId.replace(av, '');
						}
						var obj = { id: threadId, name: threadName }
						$.kes('saveKey', 'kes_thread', obj);
					});
				}
			});
		}
	};
}(kes));
