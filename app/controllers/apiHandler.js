'use strict';

function apiHandler(db) {
    var Promise = require('bluebird');
    var request = Promise.promisifyAll(require('request'));
    var col = db.collection('search');

    this.search = function(req, res) {
        var credentials = {
            auth: {
                user: process.env.API_KEY,
                pass: process.env.API_KEY,
                sendImmediately: false
            }
        };

        var uri = 'https://api.datamarket.azure.com/Bing/Search/Image?$format=json&Query=%27' + req.params.searchTerm + '%27';
        if (req.query.offset) {
            uri = uri + '&$skip=' + req.query.offset;
        }

        col.insert({
            term: req.params.searchTerm,
            when: new Date()
        });

        request.getAsync(uri, credentials)
            .then(function(response) {
                if (response.statusCode == 200) {
                    var body = JSON.parse(response.body);
                    var result = body.d.results.map(function(el) {
                        return {
                            url: el.MediaUrl,
                            snippet: el.Title,
                            thumbnail: el.Thumbnail.MediaUrl,
                            context: el.SourceUrl
                        };
                    });
                    res.json(result);
                }
                else {
                    res.end('Something wrong :(');
                }
            })
            .catch(function(err) {
                throw err;
            });
    };

    this.latest = function(req, res) {
        col.find({}, {
            _id: false
        }).sort({
            when: -1
        }).limit(20).toArray(function(err, data) {
            if (err) {
                throw err;
            }

            res.json(data);

        });
    };
}

module.exports = apiHandler;