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
        this.g = svg.append("g")
            .attr("transform", "translate(" + rect.left + "," + rect.top + ")");

        this.x = d3.scaleTime()
            .range([0, rect.width]);
        this.xAxis = d3.axisBottom(this.x).tickFormat(localization.getFormattedDate);

        this.graph1 = new ScatterPlot(new Rect(125, 525, 0, this.rect.width), this.g)
        this.graph2 = new ScatterPlot(new Rect(675, 1075, 0, this.rect.width), this.g)

        // Ajout d'un plan de découpage.
        svg.select("defs")
            .append("clipPath")
            .attr("id", "graphviz_clip")
            .append("rect")
            .attr("width", this.rect.width)
            .attr("height", this.rect.height);
    }

    initialize(data, sources, crashes, periods, color) {
        domainX(this.x, crashes);

        this._addBackground()
        this._addPeriods(periods)
        this.graph1.initialize(crashes, periods)
        this.graph2.initialize(crashes, periods)
    }

    update(newDomain) {
        // Mettre le domaine des x à jour
        this.x.domain(d3.event.selection === null ? newDomain.domain() : d3.event.selection.map(newDomain.invert));

        this._updatePeriods()
        this.graph1.update(newDomain)
        this.graph2.update(newDomain)
    }

    _addBackground() {
        this.g.append("rect")
            .attr("width", this.rect.width)
            .attr("height", this.rect.height)
            .style("stroke", "beige")
            .style("fill", "none")
            .style("stroke-width", 1)
    }

    _addPeriods(periods) {
        var height = this.rect.height;
        var x = this.x

        // Barres
        this.g.append("g").selectAll("period")
            .data(periods)
            .enter().append("rect")
            .attr("class", "period")
            .attr("x", d => x(d.StartDate))
            .attr("width", d => x(d.EndDate) - x(d.StartDate))
            .attr("height", height)
            .attr("clip-path", "url(#graphviz_clip)")
            .attr("fill", d => "rgba(128, 128, 128, 0.2");

        // Texte
        this.g.append("g").selectAll(".periodName")
            .data(periods)
            .enter()
            .append("text")
            .text(function (d) { return d.Name; })
            .attr("class", "periodName")
            .attr("id", function (d) { return "periodName" + d.Name; })
            .attr("text-anchor", "middle")
            .attr("clip-path", "url(#graphviz_clip)")
            .attr("x", d => x(this._getMiddleDate(d)))
            .attr("y", function (d) { return 0 })
            .attr("dy", "1.5em")
            .attr("font-weight", "bold");
    }

    _updatePeriods() {
        var x = this.x
        this.g.selectAll("rect.period")
            .attr("x", d => x(d.StartDate))
            .attr("width", d => x(d.EndDate) - x(d.StartDate));

        this.g.selectAll(".periodName")
            .attr("x", d => x(this._getMiddleDate(d)))
    }

    _getMiddleDate(d) {
        return new Date((d.StartDate.getTime() + d.EndDate.getTime()) / 2)
    }
}