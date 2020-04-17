/**
 * INF8808 - Visualisation de données - Hiver 2020
 * Projet Final - Équipe 2
 * 
 * Visualisation de donnée sur les écrasements d'avion depuis 1908
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

class Rect {
    constructor(top, bottom, left, right) {
        this.top = top;
        this.bottom = bottom;
        this.left = left;
        this.right = right;
        this.width = right - left;
        this.height = bottom - top;
    }
}

((L, d3, localization) => {

    /***** Configuration *****/
    const sliderRect = new Rect(0, 50, 100, 1200);
    const timelineRect = new Rect(50, 1200, 100, 1200);
    const graph1Rect = new Rect(200, 600, 100, 1200);
    const graph2Rect = new Rect(725, 1125, 100, 1200);


    /***** Création des éléments *****/
    const svg = d3.select("body")
        .append("svg")
        .attr("width", 1400)
        .attr("height", 1700);

    // Pour définir les clip-paths
    svg.append("defs")

    // Création des éléments
    const map = new MapViz(L);
    const slider = new Slider(sliderRect, svg);
    const timeline = new Timeline(timelineRect, svg);
    const graph1 = new LineChart(graph1Rect, svg);
    const graph2 = new ScatterPlot(graph2Rect, svg);

    /***** Chargement des données *****/
    Promise.all([
        d3.csv("./data/with_location_from_gouv_fr.csv"),
        d3.csv("./data/periods.csv"),
        d3.json("./data/places-location.json")
    ])
        .then((data) => {
            const crashes = data[0];
            const periods = data[1];
            const placesLocation = data[2];

            // Prétraitement des données
            parseDate(crashes);
            parseDate(periods, ["StartDate", "EndDate"]);

            // Initialisation des élements
            slider.initialize(crashes, periods)
            timeline.initialize(crashes, periods);
            graph1.initialize(crashes, periods)
            graph2.initialize(crashes, periods);
            map.initialize(crashes, placesLocation);

            // Ajout des callbacks lors des changements de timeline
            slider.onSelectionChanged = () => {
                map.update(slider.x);
                timeline.update(slider.x);
                graph1.update(slider.x)
                graph2.update(slider.x);
            }
        });
})(L, d3, localization);
