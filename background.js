chrome.browserAction.onClicked.addListener(function() {
    var detail = {
        popup: 'popup.html'
    };
    chrome.browserAction.setPopup(detail);
});
