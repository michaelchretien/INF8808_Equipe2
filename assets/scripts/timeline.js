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
function createTimeline(g, sources, line, color) {
    g.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .style("stroke", "black")
        .style("fill", "none")
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
        .attr("d", function (d) {
            return line(d.values);
        })
        .style("stroke", function (d) {
            return color(d.name);
        })
        .attr("clip-path", "url(#clip)")
        .style("stroke", function (d) {
            if (d.name === "Moyenne") {
                return "black"
            }
            return color(d.name);
        })
        .style("stroke-width", function (d) {
            if (d.name === "Moyenne") {
                return 2;
            }
            return 1;
        })
        .attr("value", function (d) {
            return d.name
        }).attr("id", function (d) {
            return "focus" + d.name;
        });
}