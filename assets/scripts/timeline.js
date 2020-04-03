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

/**
* Crée les graphiques.
*
* @param g         Le groupe SVG dans lequel le graphique doit être dessiné.
* @param sources   Les données à utiliser.
* @param line      La fonction permettant de dessiner les lignes du graphique.
* @param color     L'échelle de couleurs ayant une couleur associée à un nom de rue.
*/
function createTimeline(g, sources, line, color, xAxisTimeline, rect, brush) {
    g.append("rect")
        .attr("width", rect.width)
        .attr("height", rect.height)
        .style("stroke", "black")
        .style("fill", "green")
        .style("stroke-width", 1)
        .attr("transform", "translate(-60, 0)");

    var focusLineGroups = g.append("g")
        .attr("class", "focus")
        .selectAll("g")
        .data(sources)
        .enter()
        .append("g");

    focusLineGroups.append("path")
        .attr("class", "line")
        .attr("d", d => line(d.values))
        .style("stroke", d => color(d.name))
        .attr("clip-path", "url(#clip)")
        .style("stroke", d => (d.name === "Moyenne") ? "black" : color(d.name))
        .style("stroke-width", d => (d.name === "Moyenne") ? 2 : 1)
        .attr("value", d => d.name)
        .attr("id", d => "focus" + d.name);

    // Axes
    var height = rect.bottom - rect.top
    g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxisTimeline);

    g.append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
        .attr("y", -6)
        .attr("height", height);
}
