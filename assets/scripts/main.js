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

(function (d3, localization) {
  "use strict";

  /***** Configuration *****/
  var mapRect = new Rect(0, 1200, 0, 100);
  var timelineRect = new Rect(400, 460, 100, 900);
  var graphRect = new Rect(460, 1200, 100, 900);

  /***** Création des éléments *****/
  var svg = d3.select("body")
    .append("svg")
    .attr("width", 1200)
    .attr("height", 1300);

  // Création des éléments
  var timeline = new Timeline(timelineRect, svg)
  var graphs = new GraphViz(graphRect, svg)
  var map = new MapViz(mapRect, svg)

  /***** Chargement des données *****/
  d3.csv("./data/2016.csv").then(function (data) {
    // Prétraitement des données
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    domainColor(color, data);
    parseDate(data);
    var sources = createSources(color, data);

    // Initialisation des élements
    map.initialize(data, sources, color);
    graphs.initialize(data, sources, color);
    timeline.initialize(data, sources, color);

    // Ajout des callbacks lors des changements de timeline
    timeline.onSelectionChanged = function () {
      graphs.update(timeline.x)
      map.update(timeline.x)
    }
  });
})(d3, localization);
