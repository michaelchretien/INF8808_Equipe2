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

function Rect(top, bottom, left, right) {
  this.top = top;
  this.bottom = bottom;
  this.left = left;
  this.right = right;
  this.width = right - left;
  this.height = bottom - top;
}

(function (d3, localization) {
  "use strict";

  /***** Configuration *****/
  var mapRect = new Rect(0, 1200, 0, 100);
  var timelineRect = new Rect(400, 460, 100, 900);
  var graphRect = new Rect(460, 1200, 100, 900);

  /***** Échelles *****/
  var xGraph = d3.scaleTime().range([0, graphRect.width]);
  var yGraph = d3.scaleLinear().range([graphRect.height, 0]);

  var xAxisGraph = d3.axisBottom(xGraph).tickFormat(localization.getFormattedDate);
  var yAxisGraph = d3.axisLeft(yGraph);


  /***** Création des éléments *****/
  var svg = d3.select("body")
    .append("svg")
    .attr("width", 1200)
    .attr("height", 1300);

  var map = svg.append("g")
    .attr("transform", "translate(" + mapRect.left + "," + mapRect.top + ")");
  var graph = svg.append("g")
    .attr("transform", "translate(" + graphRect.left + "," + graphRect.top + ")");

  // Ajout d'un plan de découpage.
  svg.append("defs")
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", 1500)
    .attr("height", 2000);

  // Fonctions pour dessiner les lignes
  var lineGraph = createLine(xGraph, yGraph);

  var timeline = new Timeline(timelineRect, svg)
  /***** Chargement des données *****/
  d3.csv("./data/2016.csv").then(function (data) {
    /***** Prétraitement des données *****/
    // Échelle permettant d'associer 10 valeurs à 10 couleurs différentes
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    domainColor(color, data);
    parseDate(data);

    var sources = createSources(color, data);
    domainX(xGraph, xTimeline, data);
    domainY(yGraph, yTimeline, sources);

    createMap(map, sources, lineGraph, color, mapRect);
    createGraph(graph, sources, lineGraph, color, xAxisGraph, yAxisGraph, graphRect);
    timeline.initialize(data, sources, color)
    timeline.onSelectionChanged = function () {
      brushUpdate(graph, lineGraph, xGraph, timeline.x, xAxisGraph, yAxisGraph);
    }
  });
})(d3, localization);
