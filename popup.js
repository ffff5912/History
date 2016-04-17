function searchHistory(seeds, keyword) {
    if (keyword === '') {
        return seeds;
    }
    return seeds.filter(function(item) {
        return item.title.match(new RegExp(keyword, 'i'));
    });
}

Vue.filter('formatDate', function(date) {
    return new Date(date);
});

var histories = new Vue({
    el: '#history-list',
    data: {
        master_items: [],
        items: [],
        keyword: '',
        favicon_api_url: 'https://www.google.com/s2/favicons?domain='
    },
    methods: {
        delete: function(e) {
            chrome.history.deleteUrl({url: e.target.dataset.url});
            this.items.splice(e.target.dataset.historyIndex, 1);
        },
        onKeyUp: function(e) {
            this.items = searchHistory(this.master_items, this.keyword);
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    var query = {
        text: ''
    };
    chrome.history.search(query, function(results) {
        histories.master_items = results;
        histories.items = results;
    });
});
