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
class MapViz {
    constructor(rect, svg) {
        this.rect = rect;
        this.g = svg.append("g")
            .attr("transform", "translate(" + rect.left + "," + rect.top + ")");
    }

    initialize() {
        this.g.append("rect")
            .attr("width", this.rect.width)
            .attr("height", this.rect.height)
            .style("stroke", "black")
            .style("fill", "red")
            .style("stroke-width", 1)
    }

    update(newDomain) {
        // DO SOMETHING :P
    }

}