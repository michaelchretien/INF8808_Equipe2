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
(function (d3, localization) {
  "use strict";

  /***** Configuration *****/
  var marginMap = {
    top: 10,
    right: 10,
    bottom: 100,
    left: 60
  };
  var widthMap = 1200 - marginMap.left - marginMap.right;
  var heightMap = 400;

  // Graphique principal (graph)
  var marginGraph = {
    top: 500,
    right: 10,
    bottom: 100,
    left: 60
  };
  var widthGraph = 1200 - marginGraph.left - marginGraph.right;
  var heightGraph = 450;

  // Graphique secondaire qui permet de choisir l'échelle de la visualisation (timelinee)
  var marginTimeline = {
    top: 375,
    right: 10,
    bottom: 30,
    left: 60
  };
  var widthTimeline = widthGraph;
  var heightTimeline = 50;

  /***** Échelles *****/
  var xGraph = d3.scaleTime().range([0, widthGraph]);
  var yGraph = d3.scaleLinear().range([heightGraph, 0]);

  var xTimeline = d3.scaleTime().range([0, widthTimeline]);
  var yTimeline = d3.scaleLinear().range([heightTimeline, 0]);

  var xAxisGraph = d3.axisBottom(xGraph).tickFormat(localization.getFormattedDate);
  var yAxisGraph = d3.axisLeft(yGraph);

  var xAxisTimeline = d3.axisBottom(xTimeline).tickFormat(localization.getFormattedDate);

  /***** Création des éléments *****/
  var svg = d3.select("body")
    .append("svg")
    .attr("width", widthGraph + marginGraph.left + marginGraph.right)
    .attr("height", heightGraph + marginGraph.top + marginGraph.bottom);

  var map = svg.append("g")
    .attr("transform", "translate(" + marginMap.left + "," + marginMap.top + ")");
  var timeline = svg.append("g")
    .attr("transform", "translate(" + marginTimeline.left + "," + marginTimeline.top + ")");
  var graph = svg.append("g")
    .attr("transform", "translate(" + marginGraph.left + "," + marginGraph.top + ")");

  // Ajout d'un plan de découpage.
  svg.append("defs")
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", widthGraph)
    .attr("height", heightGraph);

  // Fonctions pour dessiner les lignes
  var lineGraph = createLine(xGraph, yGraph);
  var lineTimeline = createLine(xTimeline, yTimeline);

  // Permet de redessiner le graphique principal lorsque le zoom/brush est modifié.
  var brush = d3.brushX()
    .extent([[0, 0], [widthTimeline, heightTimeline]])
    .on("brush", function () {
      brushUpdate(brush, graph, lineGraph, xGraph, xTimeline, xAxisGraph, yAxisGraph);
    });

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

    createMap(map, sources, lineGraph, color);
    /***** Création du graphique graph *****/
    createGraph(graph, sources, lineGraph, color);

    // Axes graph
    graph.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + heightGraph + ")")
      .call(xAxisGraph);

    graph.append("g")
      .attr("class", "y axis")
      .call(yAxisGraph);

    /***** Création du graphique timelinee *****/
    createTimeline(timeline, sources, lineTimeline, color);

    // Axes timelinee
    timeline.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + heightTimeline + ")")
      .call(xAxisTimeline);

    timeline.append("g")
      .attr("class", "x brush")
      .call(brush)
      .selectAll("rect")
      .attr("y", -6)
      .attr("height", heightTimeline + 7);
  });
})(d3, localization);
