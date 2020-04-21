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
class Timeline {
    constructor(rect, svg) {
        this.rect = rect;
        this.g = svg.append("g")
            .attr("transform", "translate(" + rect.left + "," + rect.top + ")");

        // Domaine du bas du graphique
        this.x = d3.scaleTime()
            .range([0, rect.width]);

        // Domaine du haut du graphique
        this.xTop = d3.scaleTime()
            .range([0, rect.width]);

        this.xAxis = d3.axisBottom(this.x).tickFormat(localization.getFormattedDate);
        this.heightPercent = 0.05;

        // Ajout d'un plan de découpage.
        svg.select("defs")
            .append("clipPath")
            .attr("id", "timeline_clip")
            .append("polygon")
            .attr("points", this._backgroundPoints())
    }

    initialize(crashes, periods) {
        domainX(this.x, crashes);
        domainX(this.xTop, crashes);

        this._addBackground()
        this._addPeriods(periods)
    }

    update(newDomain) {
        this.x.domain(d3.event.selection === null ? newDomain.domain() : d3.event.selection.map(newDomain.invert));
        this._updateClipPath()
        this._updatePeriods()
        this._updateBackground()
    }

    _updatePeriods() {
        this.g.selectAll("polygon.period")
            .attr("points", d => this._periodPoints(d))

        this.g.selectAll(".periodName")
            .attr("x", d => this.x(this._getMiddleDate(d)))
    }

    _updateBackground() {
        this.g.select("#timeline_bg")
            .attr("points", this._backgroundPoints())
    }

    _updateClipPath() {
        d3.select("#timeline_clip")
            .select("polygon")
            .attr("points", this._backgroundPoints())
    }

    _addBackground() {
        this.g.append("polygon")
            .attr("id", "timeline_bg")
            .attr("points", this._backgroundPoints())
            .style("stroke", "black")
            .style("fill", "none")
            .style("stroke-width", 1)
    }

    _backgroundPoints() {
        return [
            [this.xTop(this.x.domain()[0]), 0], // Haut gauche
            [this.xTop(this.x.domain()[1]), 0], // Haut droite
            [this.rect.width, this.rect.height * this.heightPercent], // Bas droite
            [this.rect.width, this.rect.height],// Bas gauche
            [0, this.rect.height],// Bas gauche
            [0, this.rect.height * this.heightPercent]// Bas gauche
        ]
    }

    _periodPoints(d) {
        return [
            [this.xTop(d.StartDate), 0], // Haut gauche
            [this.xTop(d.EndDate), 0], // Haut droite
            [this.x(d.EndDate), this.rect.height * this.heightPercent], // Bas droite
            [this.x(d.EndDate), this.rect.height], // Bas droite
            [this.x(d.StartDate), this.rect.height], // Bas droite
            [this.x(d.StartDate), this.rect.height * this.heightPercent]// Bas gauche
        ]
    }

    _addPeriods(periods) {
        // Barre Verticales
        this.g.append("g").selectAll("period")
            .data(periods)
            .enter().append("polygon")
            .attr("points", d => this._periodPoints(d))
            .attr("class", "period")
            .attr("clip-path", "url(#timeline_clip)")
            .attr("fill", (d, i) => "hsl(" + (i * 80) + ",50%,75%)");

        // Texte
        this.g.append("g").selectAll(".periodName")
            .data(periods)
            .enter()
            .append("text")
            .html(d => d.Name)
            .attr("class", "periodName")
            .attr("id", d => "periodName" + d.Name)
            .attr("text-anchor", "middle")
            .attr("clip-path", "url(#timeline_clip)")
            .attr("x", d => this.x(this._getMiddleDate(d)))
            .attr("y", this.rect.height * this.heightPercent + 10)
            .attr("dy", "1.5em")
            .attr("font-weight", "bold");
    }

    _getMiddleDate(d) {
        return new Date((d.StartDate.getTime() + d.EndDate.getTime()) / 2)
    }
}