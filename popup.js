var App = {
    favicon_api_url: 'https://www.google.com/s2/favicons?domain=',
    functions: {
        searchHistory: function(seeds, keyword) {
            if (keyword === '') {
                return seeds;
            }
            return seeds.filter(function(item) {
                return item.title.match(new RegExp(keyword, 'i'));
            });
        }
    },
    filters: {
        convertDate: function(date) {
            return new Date(date);
        },
        extractDomain: function(url) {
            return url.match(/^https?:\/\/[^\/]+/);
        }
    }
};

Vue.filter('convertDate', App.filters.convertDate);
Vue.filter('extractDomain', App.filters.extractDomain);

var histories = new Vue({
    el: '#history-list',
    data: {
        master_items: [],
        items: [],
        keyword: '',
        favicon_api_url: App.favicon_api_url
    },
    methods: {
        delete: function(e) {
            chrome.history.deleteUrl({url: e.target.dataset.url});
            this.items.splice(e.target.dataset.historyIndex, 1);
        },
        onKeyUp: function(e) {
            this.items = App.functions.searchHistory(this.master_items, this.keyword);
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
