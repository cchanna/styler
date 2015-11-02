$(function() {

	var jsCM;
	var cssCM;

	function init_codemirror(lineWrapping) {
		cssCM = CodeMirror.fromTextArea(document.getElementById('css'), {
			lineNumbers : true,
			mode:  "css",
			theme: 'default csscm',
			indentWithTabs: true,
			lineWrapping: lineWrapping,
			autofocus: true
		});
		jsCM = CodeMirror.fromTextArea(document.getElementById('js'), {
			lineNumbers : true,
			mode:  "javascript",
			theme: 'default jscm',
			indentWithTabs: true,
			lineWrapping: lineWrapping
		});
	}
	
	function init_editor(host, config, settings) {
		var width;
		var fontsize;

		fontsize = config['fontsize'];

		if(config['width'] != '' && config['width'] < 781 && config['width'] > 449) {
			width = config['width'];
		} else {
			width = '600';
		}
		$('.width').val(width);
		$('.fontsize').val(fontsize);
		$('body').css('width', width + 'px');

		$('body').prepend('<div class="host">Styler for <a href="' + host + '">' + host + '</a></div>');

		$('.css').val(settings.css);
		$('.js').val(settings.js);

		$(document).on('keyup change', function() {
			jsCM.save();
			cssCM.save();
			settings.css = $('.css').val();
			settings.js = $('.js').val();
			config['width'] = $('.width').val();
			config['fontsize'] = $('.fontsize').val();
			save_config(config);
			save_settings(host, settings);
			executeScripts(null,
				[
					{ code: "var css = "+ JSON.stringify(localStorage[host + '-css']) +";", runAt: 'document_start' },
					{ code: "var js = "+ JSON.stringify(localStorage[host + '-js']) +";", runAt: 'document_start' },
					{ file: "jquery.js", runAt: 'document_start' },
					{ file: "styler.js", runAt: 'document_start' }
				]
			);
		});

		var lineWrapping = false;

		if(config['wrap'] == 1) {
			$('.wrap').prop('checked', true);
			lineWrapping = true;
		}

		$('.wrap').change(function () {
			jsCM.toTextArea();
			cssCM.toTextArea();
			if($('.wrap:checked').length > 0) {
				config['wrap'] = 1;
				lineWrapping = true;
			} else {
				config['wrap'] = 0;
				lineWrapping = false;
			}
			save_config(config);
			init_codemirror(lineWrapping);
		});

		init_codemirror(lineWrapping);
		$('.codeMirror').css('font-size', fontsize);
	}
	
	chrome.tabs.query({'active': true, 'currentWindow': true}, function (tabs) {
		var url = tabs[0].url;
		var host = get_hostname(url);

		with_config(function (config) {
			with_settings(host, function (settings) {
				init_editor(host, config, settings);
			});
		});
	});

});
