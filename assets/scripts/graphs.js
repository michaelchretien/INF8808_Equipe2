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
        /*this.x = d3.scaleLinear()
            .domain([debutFrise, finFrise])
            .range([0, rect.width]);*/
        this.x = d3.scaleTime()
            .range([0, rect.width]);


        this.y = d3.scaleLinear()
            .domain([0, rect.height])
            .range([0, rect.height]);

        this.g = svg.append("g")
            .attr("transform", "translate(" + rect.left + "," + rect.top + ")");

        //this.line = this.createLine(this.x, this.y);
        //this.xAxis = d3.axisBottom(this.x)//.tickFormat(localization.getFormattedDate);
        //this.yAxis = d3.axisLeft(this.y);


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
        //domainY(this.y, this.y, sources);

        this.g.append("rect")
            .attr("width", this.rect.width)
            .attr("height", this.rect.height)
            .style("stroke", "black")
            .style("fill", "none")
            .style("stroke-width", 1)

        /*var contextLineGroups = this.g.append("g")
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
            .attr("id", d => "context" + d.name);*/

        var height = this.rect.height;
        var x = this.x
        // Affichage des périodes	
        this._addPeriods(periods)
        /*this.g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (this.rect.height - 30) + ")")
            .call(this.xAxis);
    
        this.g.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(50,0 )")
            .call(this.yAxis);*/
    }

    createLine(x, y) {
        // TODO: Retourner une ligne SVG (voir "d3.line"). Pour l'option curve, utiliser un curveBasisOpen.
        return d3.line()
            .defined(function (d) {
                return !isNaN(d.count);
            })
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d.count);
            })
            .curve(d3.curveBasisOpen);
    }

    update(newDomain) {
        // TODO: Redessiner le graphique focus en fonction de la zone sélectionnée dans le graphique contexte.
        /*var line = this.line
        this.x.domain(d3.event.selection === null ? newDomain.domain() : d3.event.selection.map(newDomain.invert));
        this.g.selectAll("rect.period").attr("d", function (d) {
            return line(d.values)
        });*/
        var x = this.x
        this.x.domain(d3.event.selection === null ? newDomain.domain() : d3.event.selection.map(newDomain.invert));
        this.g.selectAll("rect.period")
            .attr("x", d => x(d.StartDate))
            .attr("width", d => x(d.EndDate) - x(d.StartDate));

        this.g.selectAll(".periodName")
            .attr("x", d => x(this._getMiddleDate(d)))
        /*this.g.select(".x.axis").call(this.x);
        this.g.select(".y.axis").call(this.y);*/
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
            .attr("fill", d => "rgba(51, 204, 255, 128");

        // Texte
        this.g.append("g").selectAll(".periodName")
            .data(periods)
            .enter()
            .append("text")
            .text(function (d) { return d.Name; })
            .attr("class", "periodName")
            .attr("id", function (d) { return "periodName" + d.Name; })
            .attr("text-anchor", "middle")
            .attr("x", d => x(this._getMiddleDate(d)))
            .attr("y", function (d) { return height - 4 })
            .attr("dy", "1.5em")
            .attr("font-weight", "bold");
    }

    _getMiddleDate(d) {
        return new Date((d.StartDate.getTime() + d.EndDate.getTime()) / 2)
    }
}