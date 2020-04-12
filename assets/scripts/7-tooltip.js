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
class Tooltip {
    constructor(svg) {
        this.tip = svg.append("g")
            .attr("id", "tooltip")
            .style("display", "none");

        // Ajout du tooltip
        this.tip.append("circle")
            .attr("class", "y")
            .style("fill", "none")
            .style("stroke", "blue")
            .attr("r", 4);

        // append the rectangle to capture mouse       
        /*svg.append("rect")
            .attr("width", 1400)
            .attr("height", 1700)
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", _ => this.tip.style("display", null))
            .on("mouseout", _ => this.tip.style("display", "none"))
            .on("mousemove", this.mousemove);*/
    }

    initialize() {
    }

    update(newDomain) {
    }

    show(content) {

    }

    hide() {

    }

    mousemove() {
        var x = d3.mouse(this)[0],
            y = d3.mouse(this)[1];
        d3.select("#tooltip")
            .attr("transform",
                "translate(" + x + "," +
                y + ")");
    }
}