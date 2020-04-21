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
            worldCopyJump: true,
            preferCanvas: true,
            center: [
                34,
                10
            ],
            zoom: 2,
            minZoom: 2,
            maxZoom: 13
        };
        this._map = L.map("map", options);

        L.tileLayer(MapViz._MAP_URL)
            .addTo(this._map);
    }

    initialize(crashes, locationsCoordinates) {
        var svg = d3.select(this._map.getPanes().overlayPane).append("svg");
        var g = svg.append("g").attr("class", "leaflet-zoom-hide");

        this._markers = MapViz._generateMarkers(crashes, locationsCoordinates);

        this.update();
    }

    update(domain) {
        this._removeMarkers();

        const markersToDisplay = this._getMarkersFromDomain(domain);
        for (const marker of markersToDisplay) {
            this._map.addLayer(marker.marker);
        }
    }

    _getMarkersFromDomain(domain) {
        if (!domain) {
            return this._markers;
        }

        const [start, end] = d3.event.selection.map(domain.invert);

        return this._markers.filter(({ date }) => {
            return MapViz._dateIsBetween(date, start, end);
        });
    }

    _removeMarkers() {
        for (const marker of this._markers) {
            this._map.removeLayer(marker.marker);
        }
    }

    _getCoordinates(place) {
        if (!place) {
            return;
        }

        return this._locationsCoordinates[place];
    }

    static _generateMarkers(crashes, locationsCoordinates) {
        const markers = [];

        for (const crash of crashes) {
            const location = crash.Location;
            if (!location) {
                continue;
            }

            const coordinates = locationsCoordinates[location];
            if (!coordinates) {
                continue;
            }

            const isMilitary = MapViz._isMilitary(crash);
            const marker = MapViz._generateMarker(coordinates, isMilitary);
            if (!marker) {
                continue;
            }

            marker.bindTooltip(MapViz._getTooltipContent(crash)).openTooltip();
            const date = crash.Date;
            markers.push({
                date: date,
                marker: marker
            });
        }

        return markers;
    }

    static _generateMarker(coordinates, isMilitary) {
        // TODO Peut-être faire en sorte que le radius est plus grand lorsqu'il y a plus qu'un écrasement à une coordonnée
        const options = {
            color: isMilitary ? "red" : "orange",
            fillColor: isMilitary ? "red" : "orange",
            fillOpacity: 0.5,
            radius: 2000
        };
        return L.circle(coordinates, options);
    }

    static _isMilitary(crash) {
        return crash.Operator.includes("Military");
    }

    static _dateIsBetween(date, start, end) {
        return start.valueOf() <= date.valueOf()
            && date.valueOf() < end.valueOf();
    }

    static _getTooltipContent(c) {
        var parseDate = d3.timeFormat("%Y/%m/%d");
 
        //console.log('c', c)

        return "<b>" + c.Location + "</b>" +
            "<br><b>Date</b> : " + parseDate(c.Date) + " " + c.Time +
            "<br><b>Opérateur</b> : " + c.Operator +
            "<br><b>Route</b> : " + c.Route +
            "<br><b>Morts</b> : " + c.Fatalities +
            "<br><b>Survivants</b> : " + c.Survivors
    }

}

MapViz._MAP_URL = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png";
