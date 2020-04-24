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
 * Basé sur le code de https://observablehq.com/@sarah37/snapping-range-slider-with-d3-brush
 */

"use strict";

class Slider {
    constructor(rect, svg) {
        this.rect = rect;
        this.x = d3.scaleTime()
            .range([0, rect.width]);
        this.y = d3.scaleLinear()
            .range([rect.height, 0]);
        this.g = svg.append("g")
            .attr("transform", `translate(${rect.left}, ${rect.top})`);

        this.xAxis = d3.axisBottom(this.x)
            .tickFormat(localization.getFormattedDate);
        this.svg = svg;

        this._lastUpdate = Date.now();
        this._isLiveUpdate = false;
    }

    initialize(crashes, periods) {
        domainX(this.x, crashes);
        this._addPeriods(periods);

        const range = this.x.domain();

        // Line pour chaque années
        this.g.append("g")
            .selectAll("line")
            .data(d3.range(range[0].getFullYear(), range[1].getFullYear() + 1))
            .enter()
            .append("line")
            .attr("x1", (d) => {
                return this.x(parseYear(d));
            })
            .attr("x2", (d) => {
                return this.x(parseYear(d));
            })
            .attr("y1", 0)
            .attr("y2", this.rect.height)
            .style("stroke", "#ccc");

        // Axe contenant les années
        this.g.append("g")
            .attr("class", "x axis")
            .call(this.xAxis);

        // Ajout du brush
        const setLiveUpdate = (enabled) => {
            this._isLiveUpdate = enabled;
        };

        const x = this.x;
        const brush = d3.brushX()
            .extent([[0, 0], [this.rect.width, this.rect.height]])
            .on("brush", () => {
                const s = d3.event.selection;
                handle.attr("display", null)
                    .attr("transform", (d, i) => {
                        return `translate(${[s[i], - this.rect.height / 4]})`;
                    });

                if (this._isLiveUpdate) {
                    this.onSelectionChanged();
                }
            })
            .on("end", function () {
                if (!d3.event.sourceEvent) {
                    return;
                }

                const d0 = d3.event.selection.map(x.invert);
                const d1 = d0.map((d) => {
                    return parseYear(d.getFullYear());
                });

                d3.select(this)
                    .transition()
                    .call(d3.event.target.move, d1.map(x))
                    .on("start", () => {
                        setLiveUpdate(true);
                    })
                    .on("end", () => {
                        setLiveUpdate(false);
                    });
            });

        const gBrush = this.g.append("g")
            .attr("class", "brush")
            .call(brush);

        const handle = gBrush.selectAll(".handle--custom")
            .data([{ type: "w" }, { type: "e" }])
            .enter()
            .append("path")
            .attr("class", "handle--custom")
            .attr("d", d => this._getBrushResizePath(d));

        gBrush.selectAll(".overlay")
            .each((d) => {
                d.type = "selection";
            })
            .on("mousedown touchstart");

        gBrush.call(brush.move, range.map(x));
    }

    _getBrushResizePath(d) {
        const e = +(d.type == "e");
        const x = e ? 1 : -1;
        const y = this.rect.height / 2;

        return "M" + (.5 * x) + "," + y + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6) + "V" + (2 * y - 6) +
            "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y) + "Z" + "M" + (2.5 * x) + "," + (y + 8) + "V" + (2 * y - 8) +
            "M" + (4.5 * x) + "," + (y + 8) + "V" + (2 * y - 8);
    }

    _addPeriods(periods) {
        this.g.append("g")
            .selectAll("period")
            .data(periods)
            .enter().append("rect")
            .attr("class", "period")
            .attr("x", (d) => {
                return this.x(d.StartDate);
            })
            .attr("width", (d) => {
                return this.x(d.EndDate) - this.x(d.StartDate);
            })
            .attr("height", this.rect.height)
            .attr("clip-path", "url(#graphviz_clip)")
            .attr("fill", (d, i) => {
                return PALETTE[i];
            });

    }

    onSelectionChanged() {
        // Overide cette méthode dans le main
    }
}
