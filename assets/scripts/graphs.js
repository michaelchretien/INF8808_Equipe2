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
class GraphViz {
    constructor(rect, svg) {
        this.rect = rect;
        this.x = d3.scaleTime().range([50, rect.width - 50]);
        this.y = d3.scaleLinear().range([rect.height - 30, 0]);
        this.g = svg.append("g")
            .attr("transform", "translate(" + rect.left + "," + rect.top + ")");

        this.line = createLine(this.x, this.y);
        this.xAxis = d3.axisBottom(this.x).tickFormat(localization.getFormattedDate);
        this.yAxis = d3.axisLeft(this.y);

        // Ajout d'un plan de découpage.
        svg.select("defs")
            .append("clipPath")
            .attr("id", "graphviz_clip")
            .append("rect")
            .attr("x", 50)
            .attr("width", this.rect.width - 100)
            .attr("height", this.rect.height);
    }

    initialize(data, sources, color) {
        domainX(this.x, this.x, data);
        domainY(this.y, this.y, sources);

        this.g.append("rect")
            .attr("width", this.rect.width)
            .attr("height", this.rect.height)
            .style("stroke", "black")
            .style("fill", "none")
            .style("stroke-width", 1)

        var contextLineGroups = this.g.append("g")
            .attr("class", "context")
            .selectAll("g")
            .data(sources)
            .enter().append("g")

        contextLineGroups.append("path")
            .attr("class", "line")
            .attr("d", d => this.line(d.values))
            .attr("clip-path", "url(#graphviz_clip)")
            .style("stroke", d => (d.name === "Moyenne") ? "black" : color(d.name))
            .style("stroke-width", d => (d.name === "Moyenne") ? 2 : 1)
            .attr("id", d => "context" + d.name);

        this.g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (this.rect.height - 30) + ")")
            .call(this.xAxis);

        this.g.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(50,0 )")
            .call(this.yAxis);
    }

    update(newDomain) {
        // TODO: Redessiner le graphique focus en fonction de la zone sélectionnée dans le graphique contexte.
        var line = this.line
        this.x.domain(d3.event.selection === null ? newDomain.domain() : d3.event.selection.map(newDomain.invert));
        this.g.selectAll("path.line").attr("d", function (d) {
            return line(d.values)
        });
        this.g.select(".x.axis").call(this.x);
        this.g.select(".y.axis").call(this.y);
    }

}