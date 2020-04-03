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

/**
 * Crée les graphiques.
 *
 * @param g         Le groupe SVG dans lequel le graphique doit être dessiné.
 * @param sources   Les données à utiliser.
 * @param line      La fonction permettant de dessiner les lignes du graphique.
 * @param color     L'échelle de couleurs ayant une couleur associée à un nom de rue.
 */
function createGraph(g, sources, line, color, xAxisGraph, yAxisGraph, rect) {
    g.append("rect")
        .attr("width", rect.width)
        .attr("height", rect.height)
        .style("stroke", "black")
        .style("fill", "none")
        .style("stroke-width", 1)
        .attr("transform", "translate(-60, 0)");

    var contextLineGroups = g.append("g")
        .attr("class", "context")
        .selectAll("g")
        .data(sources)
        .enter().append("g");

    contextLineGroups.append("path")
        .attr("class", "line")
        .attr("d", d => line(d.values))
        .attr("clip-path", "url(#clip)")
        .style("stroke", d => (d.name === "Moyenne") ? "black" : color(d.name))
        .style("stroke-width", d => (d.name === "Moyenne") ? 2 : 1)
        .attr("id", d => "context" + d.name);

    // Axes graph
    var height = rect.bottom - rect.top
    g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxisGraph);

    g.append("g")
        .attr("class", "y axis")
        .call(yAxisGraph);
}

function brushUpdate(g, line, xFocus, xContext, xAxis, yAxis) {
    // TODO: Redessiner le graphique focus en fonction de la zone sélectionnée dans le graphique contexte.
    xFocus.domain(d3.event.selection === null ? xContext.domain() : d3.event.selection.map(xContext.invert));
    g.selectAll("path.line").attr("d", function (d) {
        return line(d.values)
    });
    g.select(".x.axis").call(xAxis);
    g.select(".y.axis").call(yAxis);
}