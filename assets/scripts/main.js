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

(async function (d3, localization) {
  "use strict";

  /***** Configuration *****/
  var mapRect = new Rect(0, 400, 100, 1200);
  var sliderRect = new Rect(400, 450, 100, 1200);
  var timelineRect = new Rect(450, 1600, 100, 1200);
  var graph1Rect = new Rect(550, 950, 100, 1200);
  var graph2Rect = new Rect(1125, 1525, 100, 1200);


  /***** Création des éléments *****/
  var svg = d3.select("body")
    .append("svg")
    .attr("width", 1400)
    .attr("height", 1700);

  // Pour définir les clip-paths
  svg.append("defs")

  // Création des éléments
  var map = new MapViz(mapRect, svg)
  var slider = new Slider(sliderRect, svg)
  var timeline = new Timeline(timelineRect, svg)
  var graph1 = new ScatterPlot(graph1Rect, svg)
  var graph2 = new ScatterPlot(graph2Rect, svg)

  /***** Chargement des données *****/
  d3.csv("./data/with_location_from_gouv_fr.csv").then(async function (crashes) {
    var periods = await d3.csv("./data/periods.csv");

    // Prétraitement des données
    parseDate(crashes);
    parsePeriodDate(periods);

    // Initialisation des élements
    slider.initialize(crashes, periods)
    timeline.initialize(crashes, periods);
    graph1.initialize(crashes, periods)
    graph2.initialize(crashes, periods);
    map.initialize(crashes, periods);

    // Ajout des callbacks lors des changements de timeline
    slider.onSelectionChanged = function () {
      map.update(slider.x);
      timeline.update(slider.x);
      graph1.update(slider.x)
      graph2.update(slider.x);
    }
  });
})(d3, localization);
