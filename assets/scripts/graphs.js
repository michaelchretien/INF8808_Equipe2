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

        this._addBackground()
        this._addPeriods(periods)
        this._addGraph1(crashes)
        this._addGraph2(crashes)
    }

    update(newDomain) {
        // Mettre le domaine des x à jour
        this.x.domain(d3.event.selection === null ? newDomain.domain() : d3.event.selection.map(newDomain.invert));

        this._updatePeriods()
        this._updateGraph1()
        this._updateGraph2()
    }

    _addBackground() {
        this.g.append("rect")
            .attr("width", this.rect.width)
            .attr("height", this.rect.height)
            .style("stroke", "beige")
            .style("fill", "none")
            .style("stroke-width", 1)
    }

    _addGraph1(crashes) {
        var g = this.g.append("g")
            .attr("transform", "translate( 0, " + (this.rect.height / 2) + ")");

        var height = this.rect.height / 2
        this.yGraph1 = d3.scaleLinear()
            .domain([0, 600])
            .range([height, 0]);

        var x = this.x
        var y = this.yGraph1

        //this.xAxisGraph1 = d3.axisBottom(this.x).tickFormat(localization.getFormattedDate);
        this.yAxisGraph1 = d3.axisLeft(this.yGraph1);

        g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (this.rect.height / 2) + ")")
            .call(this.xAxis);

        g.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(0,0 )")
            .call(this.yAxisGraph1);

        g.selectAll("dot")
            .data(crashes)
            .enter()
            .append("circle")
            .attr("class", "graph1")
            .attr("cx", d => x(d.Date))
            .attr("cy", d => y(d.Fatalities))
            .attr("clip-path", "url(#graphviz_clip)")
            .attr("r", 1.5)
            .style("fill", "black")
    }

    _addGraph2(crashes) {
        var g = this.g.append("g");

        var height = this.rect.height / 2
        this.yGraph2 = d3.scaleLinear()
            .domain([0, 600])
            .range([height, 0]);

        var x = this.x
        var y = this.yGraph2

        //this.xAxisGraph1 = d3.axisBottom(this.x).tickFormat(localization.getFormattedDate);
        this.yAxisGraph2 = d3.axisLeft(this.yGraph2);

        g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(this.xAxis);

        g.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(0,0 )")
            .call(this.yAxisGraph2);

        g.selectAll("dot")
            .data(crashes)
            .enter()
            .append("circle")
            .attr("class", "graph2")
            .attr("cx", d => x(d.Date))
            .attr("cy", d => y(d.Aboard))
            .attr("clip-path", "url(#graphviz_clip)")
            .attr("r", 1.5)
            .style("fill", "black")
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
                  .attr("id", d => "context" + d.name);
      
              this.g.append("g")
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + (this.rect.height - 30) + ")")
                  .call(this.xAxis);
      
              this.g.append("g")
                  .attr("class", "y axis")
                  .attr("transform", "translate(50,0 )")
                  .call(this.yAxis);*/
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

    _updateGraph1() {
        var x = this.x
        var y = this.yGraph1
        this.g.selectAll(".graph1")
            .attr("cx", d => x(d.Date))
            .attr("cy", d => y(d.Fatalities))
        this.g.select(".x.axis").call(this.xAxis);
    }


    _updateGraph2() {
        var x = this.x
        var y = this.yGraph1
        this.g.selectAll(".graph2")
            .attr("cx", d => x(d.Date))
            .attr("cy", d => y(d.Aboard))
        this.g.select(".x.axis").call(this.xAxis);
        // TODO: Redessiner le graphique focus en fonction de la zone sélectionnée dans le graphique contexte.
        /*var line = this.line
        this.x.domain(d3.event.selection === null ? newDomain.domain() : d3.event.selection.map(newDomain.invert));
        this.g.selectAll("rect.period").attr("d", function (d) {
            return line(d.values)
        });*/
        /*this.g.select(".x.axis").call(this.x);
        this.g.select(".y.axis").call(this.y);*/
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