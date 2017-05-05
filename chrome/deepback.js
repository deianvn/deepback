chrome.webNavigation.onCommitted.addListener(function (data) {
    if (data.frameId !== 0) {
        // Don't trigger on iframes
        return;
    }

    var tabIdToUrl = {};
    tabIdToUrl[data.tabId.toString()] = data.url;
    window.sessionStorage.set(tabIdToUrl);
});

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var url = tabs[0].url;

        window.sessionStorage.get(tabId, function (item) {
            var url = item[tabId];
        });

        chrome.history.search({text: '', maxResults: 15}, function(data) {
            var count = 1;
            data.forEach(function(page) {
                url = page.url;
            });

            chrome.tabs.executeScript(null,{"code": "history.go(" + (-count) + ")"});
        });
    });
});
