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
function createMap(g, sources, line, color, rect) {
    g.append("rect")
        .attr("width", rect.width)
        .attr("height", rect.height)
        .style("stroke", "black")
        .style("fill", "red")
        .style("stroke-width", 1)
        .attr("transform", "translate(-60, 0)");
}