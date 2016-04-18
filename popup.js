var App = {
    histories: {},
    favicon_api_url: 'https://www.google.com/s2/favicons?domain=',
    searchHistory: function(seeds, keyword) {
        if (keyword === '') {
            return seeds;
        }

        return seeds.filter(function(item) {
            return item.title.match(new RegExp(keyword, 'i'));
        });
    },
    filters: {
        convertDate: function(date) {
            return new Date(date);
        },
        extractDomain: function(url) {
            return url.match(/^https?:\/\/[^\/]+/);
        },
        renderTitle: function(title) {
            if (title.length > 0) {
                return title;
            }

            return 'タイトルなし';
        }
    },
    build: function() {
        Vue.filter('convertDate', this.filters.convertDate);
        Vue.filter('extractDomain', this.filters.extractDomain);
        Vue.filter('renderTitle', this.filters.renderTitle);
        this.histories = new Vue({
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
                    App.histories.items.splice(e.target.dataset.historyIndex, 1);
                },
                onKeyUp: function(e) {
                    App.histories.items = App.searchHistory(App.histories.master_items, App.histories.keyword);
                }
            }
        });
    }
};

App.build();

document.addEventListener('DOMContentLoaded', function() {
    var query = {
        text: ''
    };
    chrome.history.search(query, function(results) {
        App.histories.master_items = results;
        App.histories.items = results;
    });
});
