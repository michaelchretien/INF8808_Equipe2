/**
 * INF8808 - Visualisation de données - Hiver 2020
 * Projet Final - Équipe 2
 * 
 * Visualisation de donnée sur les écrasements d"avion depuis 1908
 * 
 * Hugo Tremblay
 * Gabriel Cyr-St-Georges
 * Kevin Pastor
 * Elias Jambari
 * Michaël Chrétien 
 *
 * Basé sur le code du TP2
 */

"use strict";
class MapViz {
    constructor(L) {
        const options = {
            "worldCopyJump": true
        };
        this.map = L.map("map", options);
        this.markers = [];
    }

    initialize(crashes, placesLocation) {
        this.placesLocation = placesLocation;
        this.crashes = crashes;

        const coordinates = [34, 10];
        const zoom = 2;
        this.map.setView(coordinates, zoom);

        const url = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png";
        const options = {
            maxZoom: 10,
            minZoom: zoom
        };

        L.tileLayer(url, options)
            .addTo(this.map);

        this.update();
    }

    update(domain) {
        this._removeMarkers();

        const currentCrashes = this._getCrashesFromDomain(domain);
        for (const crash of currentCrashes) {
            this._addMarker(crash.Location);
        }
    }

    _getCrashesFromDomain(domain) {
        return this.crashes
            .filter((crash) => {
                // TODO Filtrer les crash par rapport au domaine
                return true;
            });
    }

    _addMarker(place) {
        if (!place || !this.placesLocation[place]) {
            return;
        }

        const location = this.placesLocation[place];

        // TODO Peut-être faire en sorte que le radius est plus grand lorsqu'il y a plus qu'un écrasement à une coordonnée
        // TODO Changer la couleur par rapport à si c'est un vol militaire ou commercial
        const options = {
            color: "red",
            fillColor: "#FF0033",
            fillOpacity: 0.5,
            radius: 50
        };
        const marker = L.circle([location.lat, location.lng], options);
        marker.addTo(this.map);
        this.markers.push(marker);
    }

    _removeMarkers() {
        for (const marker of this.markers) {
            this.map.removeLayer(marker);
        }

        this.markers = [];
    }

    // Method used for prefetching the locations for all crashes
    async _getPlacesLocation(crashes) {
        const places = crashes.map((crash) => {
            return crash.Location;
        });

        const placesLocation = {};

        places.reduce((p, x) => {
            return p.then(_ => this._getPlaceLocation(x));
        },
            Promise.resolve());

        for (let i = 0; i < places.length; i++) {
            const place = places[i];
            const location = await this._getPlaceLocation(place);
            placesLocation[place] = location;
            console.log(i);
            console.log(placesLocation);
        }
    }

    // Method used for prefetching the locations for all crashes
    _getPlaceLocation(name) {
        const apiKey = "";
        const place = encodeURIComponent(name);
        const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${place}&inputtype=textquery&key=${apiKey}`;
        const options = {
            mode: "cors",
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
        };

        return fetch(url, options)
            .then((response) => {
                if (!response.ok) {
                    console.log(response);
                    throw new Error("FindPlaceFromText: fetch error");
                }

                return response.json();
            })
            .then((response) => {
                if (response.status !== "OK") {
                    console.log(response);
                    throw new Error("FindPlaceFromText: API error");
                }

                if (!response.candidates || response.candidates.length === 0) {
                    console.log(response);
                    throw new Error("FindPlaceFromText: No candidate");
                }

                return response.candidates[0].place_id;
            })
            .then((placeID) => {
                return fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeID}&key=${apiKey}`)
            })
            .then((response) => {
                if (!response.ok) {
                    console.log(response);
                    throw new Error("Details: fetch error");
                }

                return response.json();
            })
            .then((response) => {
                if (response.status !== "OK") {
                    console.log(response);
                    throw new Error("Details: API error");
                }

                return response.result.geometry.location;
            })
            .catch((error) => {
                console.error(error);
            });
    }

}
