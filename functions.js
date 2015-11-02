function executeScripts(tabId, injectDetailsArray) {
	function createCallback(tabId, injectDetails, innerCallback) {
		return function () {
			chrome.tabs.executeScript(tabId, injectDetails, innerCallback);
		};
	}

	var callback = null;

	for (var i = injectDetailsArray.length - 1; i >= 0; --i)
		callback = createCallback(tabId, injectDetailsArray[i], callback);

	if (callback !== null)
		callback();   // execute outermost function
}

function addslashes( str ) {
	return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}

function cl(data) {
	console.log(data);
}

function get_hostname(url) {
	return url.toString().replace(/^(.*\/\/[^\/?#]*).*$/,"$1");
}

function with_config(fn) {
	chrome.storage.sync.get('config', function (values) {
		fn(values.config || {});
	});
}

function save_config(config) {
	chrome.storage.sync.set({config: config});
}

function with_settings(hostname, fn) {
	function load_legacy_settings() {
		if (localStorage[hostname + '-js'] || localStorage[hostname + '-css']) {
			return {
				js: localStorage[hostname + '-js'],
				css: localStorage[hostname + '-css']
			};
		}
	}
	chrome.storage.sync.get(hostname, function (values) {
		fn(values[hostname] || load_legacy_settings() || {});
	});
}

function save_settings(hostname, settings) {
	var values = {};

	values[hostname] = settings;

	chrome.storage.sync.set(values);
}
