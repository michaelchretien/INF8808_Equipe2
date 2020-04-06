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
  var timelineRect = new Rect(400, 460, 100, 1200);
  var graphRect = new Rect(460, 1600, 100, 1200);


  /***** Création des éléments *****/
  var svg = d3.select("body")
    .append("svg")
    .attr("width", 1400)
    .attr("height", 1700);

  // Pour définir les clip-paths
  svg.append("defs")

  // Création des éléments
  var timeline = new Timeline(timelineRect, svg)
  var graphs = new GraphViz(graphRect, svg)
  var map = new MapViz(mapRect, svg)

  /***** Chargement des données *****/
  d3.csv("./data/with_location_from_gouv_fr.csv").then(async function (crashes) {
    var periods = await d3.csv("./data/periods.csv");

    // Prétraitement des données
    parseDate(crashes);
    parsePeriodDate(periods);

    // Initialisation des élements
    graphs.initialize(crashes, periods);
    timeline.initialize(crashes, periods);
    map.initialize(crashes, periods);

    // Ajout des callbacks lors des changements de timeline
    timeline.onSelectionChanged = function () {
      graphs.update(timeline.x)
      map.update(timeline.x)
    }
  });
})(d3, localization);
