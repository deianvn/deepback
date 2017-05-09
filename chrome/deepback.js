var PREFIX = "DEEPBACK_TABHISTORY_";

chrome.webNavigation.onCommitted.addListener(function (data) {

    if (data.frameId !== 0) {
        // Don't trigger on iframes
        return;
    }

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {

        if (tabs[0] != null) {
            var tabId = tabs[0].id;
            var key = PREFIX + tabId;

            chrome.storage.local.get(key, function(item) {
                var tabHistory = item[key] ? item[key] : [];
                tabHistory.unshift(data.url);
                var storeObject = {};
                storeObject[key] = tabHistory;
                chrome.storage.local.set(storeObject);
            });
        }
    });

});

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {

        if (tabs[0] != null) {
            var tabId = tabs[0].id;
            var url = tabs[0].url;
            var key = PREFIX + tabId;

            chrome.storage.local.get(key, function (item) {
                var tabHistory = item[key];

                if (tabHistory.length > 0) {
                    var count = 0;
                    url = urlToDomain(url);

                    for (var i = 0; i < tabHistory.length; i++) {
                        var historyUrl = tabHistory[i];

                        if (urlToDomain(historyUrl) != url) {
                            break;
                        }

                        count++;
                    }

                    var storeObject = {};
                    storeObject[key] = tabHistory.slice(count, tabHistory.length);
                    chrome.storage.local.set(storeObject);
                    chrome.tabs.executeScript(null,{"code": "history.go(" + (-count) + ")"});
                }
            });
        }
    });
});

function urlToDomain(url) {
    var chunks = url.split("/");

    return chunks[0] + "//" + chunks[2];
}
