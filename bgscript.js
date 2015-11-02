/*
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if (request.method == "getLocalStorage")
		sendResponse({data: localStorage[request.key]});
	else
		sendResponse({}); // snub them.
});
*/

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	var url = tab.url;

	if (! /^https?.*$/.test(url)) {
		return; // ignore non-http(s) schemes (including "chrome://")
	}

	var host = get_hostname(url);

	with_settings(host, function (settings) {
		executeScripts(tabId,
			[
				{ code: "var css = "+ JSON.stringify(localStorage[host + '-css']) +";", runAt: 'document_start' },
				{ code: "var js = "+ JSON.stringify(localStorage[host + '-js']) +";", runAt: 'document_start' },
				{ file: "jquery.js", runAt: 'document_start' },
				{ file: "styler.js", runAt: 'document_start' }
			]
		);
	});
});
