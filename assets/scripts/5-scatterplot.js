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

class ScatterPlot {
    constructor(rect, svg) {
        this.rect = rect;
        this.g = svg.append("g")
            .attr("transform", `translate(${rect.left},${rect.top})`);

        this.x = d3.scaleTime()
            .range([0, rect.width]);

        this.y = d3.scaleLinear()
            .range([this.rect.height, 0]);

        this.xAxis = d3.axisBottom(this.x)
            .tickFormat(localization.getFormattedDate);
        this.yAxis = d3.axisLeft(this.y);

        // Ajout d'un plan de découpage
        svg.select("defs")
            .append("clipPath")
            .attr("id", "scatterplot_clip")
            .append("rect")
            .attr("width", this.rect.width)
            .attr("height", this.rect.height);

        this.tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-8, 0])
            .html((c) => {
                return this._getTooltipContent(c);
            });

        this.g.call(this.tip);
    }

    initialize(crashes) {
        this.data = crashes;

        domainX(this.x, crashes);
        this._updateDomainY();

        // Titre
        this.g.append("text")
            .attr("x", (this.rect.width / 2))
            .attr("y", -30)
            .attr("class", "plot-title")
            .text("Nombre de décès par accident");

        // Axe horizontal
        this.g.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0,${this.rect.height})`)
            .call(this.xAxis);

        // Titre axe horizontal
        this.g.append("text")
            .attr("transform", `translate(${this.rect.width - 10} ,${this.rect.height + 40})`)
            .style("text-anchor", "end")
            .text("Date");

        // Axe vertical
        this.g.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(0, 0)")
            .call(this.yAxis);

        // Titre axe vertical
        this.g.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".75em")
            .text("Nombre de décès");

        // Points
        this.g.selectAll("dot")
            .data(crashes)
            .enter()
            .append("circle")
            .attr("cx", (d) => {
                return this.x(d.Date);
            })
            .attr("cy", (d) => {
                return this.y(d.Fatalities);
            })
            .attr("clip-path", "url(#scatterplot_clip)")
            .attr("r", 2)
            .style("fill", (d) => {
                return d.Operator.includes("Military") ? "red" : "orange";
            })
            .on("mouseover", this.tip.show)
            .on("mouseout", this.tip.hide);
    }

    update(newDomain) {
        this.x.domain(d3.event.selection === null ? newDomain.domain() : d3.event.selection.map(newDomain.invert));
        this._updateDomainY();

        this.g.selectAll("circle")
            .attr("cx", (d) => {
                return this.x(d.Date);
            })
            .attr("cy", (d) => {
                return this.y(d.Fatalities);
            });

        this.g.select(".x.axis")
            .call(this.xAxis);
        this.g.select(".y.axis")
            .call(this.yAxis);
    }

    _updateDomainY() {
        const range = this.x.domain();
        const fatalities = this.data.filter((crash) => {
            return crash.Date >= range[0] && crash.Date <= range[1];
        })
            .map((crash) => {
                return parseInt(crash.Fatalities);
            });

        this.y.domain([0, d3.max(fatalities) + 100]);
    }

    _getTooltipContent(c) {
        const parseDate = d3.timeFormat("%Y/%m/%d");

        return "<b>" + c.Location + "</b>" +
            "<br><b>Date</b> : " + parseDate(c.Date) + " " + c.Time +
            "<br><b>Opérateur</b> : " + c.Operator +
            "<br><b>Route</b> : " + c.Route +
            "<br><b>Morts</b> : " + c.Fatalities +
            "<br><b>Survivants</b> : " + c.Survivors;
    }
}