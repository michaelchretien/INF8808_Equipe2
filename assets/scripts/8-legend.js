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

class Legend {
    constructor() {
        const svg = d3.select("#legend")
            .attr("width", 1200)
            .attr("height", 20);

        svg.append("circle")
            .attr("cx", 60)
            .attr("cy", 10)
            .attr("r", 6)
            .style("fill", "red");
        svg.append("circle")
            .attr("cx", 200)
            .attr("cy", 10)
            .attr("r", 6)
            .style("fill", "orange");
        svg.append("text")
            .attr("x", 70)
            .attr("y", 12)
            .text("Militaire")
            .style("font-size", "15px")
            .attr("alignment-baseline", "middle");
        svg.append("text")
            .attr("x", 210)
            .attr("y", 12)
            .text("Civil")
            .style("font-size", "15px")
            .attr("alignment-baseline", "middle");
    }
}
