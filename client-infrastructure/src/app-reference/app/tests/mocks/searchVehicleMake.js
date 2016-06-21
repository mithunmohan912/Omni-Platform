var searchVehicleMake = {
  "_links": {
    "cscrel:item-type": {"href": "http://20.33.40.152:10114/csc/insurance/schemas/referential_vehicle_makes/referentialVehicleDocument"},
    "first": {"href": "http://20.33.40.152:10114/csc/insurance/referential_vehicle_makes?_num=30"},
    "item": [
      {
        "href": "http://20.33.40.152:10114/csc/insurance/referential_vehicle_makes/ID-UpeSMcC",
        "name": "MERCEDES(Voiture)",
        "summary": {"referential_vehicle:make": "MERCEDES"},
        "title": "MERCEDES(Voiture)"
      },
      {
        "href": "http://20.33.40.152:10114/csc/insurance/referential_vehicle_makes/ID-UpeSMeE",
        "name": "MERCURY(Voiture)",
        "summary": {"referential_vehicle:make": "MERCURY"},
        "title": "MERCURY(Voiture)"
      },
      {
        "href": "http://20.33.40.152:10114/csc/insurance/referential_vehicle_makes/ID-UpeSMlA",
        "name": "MERLIN(Voiture)",
        "summary": {"referential_vehicle:make": "MERLIN"},
        "title": "MERLIN(Voiture)"
      }
    ],
    "self": {
      "href": "http://20.33.40.152:10114/csc/insurance/referential_vehicle_makes",
      "name": "(Referential Vehicle)",
      "title": "(Referential Vehicle)"
    },
    "type": {"href": "http://20.33.40.152:10114/csc/insurance/schemas/referential_vehicle_makes/referentialVehicleCollection"},
    "up": {"href": "http://20.33.40.152:10114/csc/insurance"}
  },
  "_options": {
    "links": [{
      "href": "http://20.33.40.152:10114/csc/insurance/referential_vehicle_makes",
      "mediaType": "application/vnd.hal+json",
      "method": "GET",
      "rel": "search",
      "schema": {"properties": {
        "_count": {
          "minimum": 500,
          "type": "integer"
        },
        "_num": {"type": "integer"},
        "_sort": {
          "items": {"type": "string"},
          "type": "array"
        },
        "_start": {
          "minimum": 0,
          "type": "integer"
        },
        "referential_vehicle:make": {
          "maxLength": 25,
          "type": "string"
        },
        "referential_vehicle:type": {
          "enum": [
            "both",
            "car",
            "motocycle"
          ],
          "type": "string"
        }
      }},
      "title": "Search for a (Referential Vehicle)  by criteria"
    }],
    "title": "(Referential Vehicle) collection interactions"
  }
}