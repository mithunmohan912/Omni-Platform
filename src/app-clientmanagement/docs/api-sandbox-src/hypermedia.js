var hypermedia = {
                    "hypermedia": {
                        "required": [
                            "href"
                        ],
                        "type" : "object",
                        "properties": {
                            "title": {
                                "type": "string"
                            },
                            "href": {
                                "type": "string"
                            },
                            "method": {
                                "type": "string"
                            },
                            "name": {
                                "type": "string"
                            },
                            "rel": {
                                "type": "string"
                            }
                        }
                    }
};

var _link = {
        "self": hypermedia,
        "next": hypermedia,
        "prev": hypermedia,
        "up":   hypermedia
};

exports.hypermediaSchema = function () {
                return _link;
};