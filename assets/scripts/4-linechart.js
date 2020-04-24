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

class LineChart {
    constructor(rect, svg) {
        this.rect = rect;
        this.x = d3.scaleTime()
            .range([0, rect.width]);

        this.y = d3.scaleLinear()
            .domain([0, rect.height])
            .range([0, rect.height]);

        this.g = svg.append("g")
            .attr("transform", `translate(${rect.left},${rect.top})`);

        this.line = this._createLine(this.x, this.y);
        this.xAxis = d3.axisBottom(this.x);
        this.yAxis = d3.axisLeft(this.y);

        // Ajout d'un plan de découpage.
        svg.select("defs")
            .append("clipPath")
            .attr("id", "linechart_clip")
            .append("rect")
            .attr("width", this.rect.width)
            .attr("height", this.rect.height);

        this.tooltip = new Tooltip(this.g, this.rect);
        this.tooltip.getPosition = (x, y) => {
            return this._getTooltipPosition(x, y);
        };
        this.tooltip.getCirclePosition = (x, y) => {
            return this._getCirclePositions(x, y);
        };
        this.tooltip.getLinePosition = (x, y) => {
            return this._getLinePosition(x, y);
        };
        this.tooltip.getContent = () => {
            return this._getTooltipContent(this.currentYear);
        };
    }

    initialize(crashes) {
        domainX(this.x, crashes);

        this.data = this._prepareData(crashes);

        this._updateDomainY();

        this.g.append("g")
            .attr("class", "context")
            .selectAll("g")
            .data(this.data.map((d) => {
                return d.values;
            }))
            .enter()
            .append("g")
            .append("path")
            .attr("class", "line")
            .attr("d", (d) => {
                return this.line(d);
            })
            .style("stroke", (years) => {
                for (const year of years) {
                    if (!year.values || year.values.length === 0) {
                        continue;
                    }

                    return year.values[0].Operator.includes("Military") ? "red" : "orange";
                }

                return "orange";
            })
            .attr("id", (d) => {
                return `context${d.key}`;
            });

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
            .call(this.yAxis);

        // Titre axe vertical
        this.g.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".75em")
            .text("Nombre de décès");

        // Titre
        this.g.append("text")
            .attr("x", (this.rect.width / 2))
            .attr("y", -30)
            .attr("class","plot-title")
            .text("Évolution du nombre de décès par année");
    }

    update(newDomain) {
        this.tooltip.hide();
        this.x.domain(d3.event.selection === null ? newDomain.domain() : d3.event.selection.map(newDomain.invert));
        this._updateDomainY();

        this.g.selectAll("path.line")
            .attr("d", (d) => {
                return this.line(d);
            });

        this.g.select(".x.axis")
            .call(this.xAxis);
        this.g.select(".y.axis")
            .call(this.yAxis);

    }

    _prepareData(crashes) {
        const data = d3.nest()
            .key((d) => {
                return d.Operator.includes("Military") ? "Militaire" : "Civil";
            })
            .key((d) => {
                return d.Date.getFullYear();
            })
            .sortKeys(d3.ascending)
            .entries(crashes);

        const minYear = this.x.domain()[0].getFullYear();
        const maxYear = this.x.domain()[1].getFullYear();

        for (const type of data) {
            let i = 0;
            for (let year = minYear; year <= maxYear; year++) {
                if (type.values[i].key != year) {
                    type.values.splice(i, 0, { key: year, values: [] });
                }
                i++;
            }
        }

        return data;
    }

    _updateDomainY() {
        const minYear = this.x.domain()[0].getFullYear();
        const maxYear = this.x.domain()[1].getFullYear();

        let max = 0;
        for (let i = minYear; i <= maxYear; i++) {
            const values = this._getValues(parseYear(i));
            for (const type of values) {
                max = d3.max([max, this._getTotalFatalities(type)]);
            }
        }

        this.y.domain([max + 100, 0]);
    }

    _createLine(x, y) {
        const parser = d3.timeParse("%Y");

        return d3.line()
            .x((d) => {
                return x(parser(d.key));
            })
            .y((d) => {
                return y(this._getTotalFatalities(d.values));
            })
            .curve(d3.curveMonotoneX);
    }

    _getTooltipYear(mousePosX) {
        const reversedDate = this.x.invert(mousePosX);
        this.currentYear = d3.timeParse("%Y")(reversedDate.getFullYear() + (reversedDate.getMonth() > 5 ? 1 : 0));

        return this.currentYear;
    }

    _getLinePosition(x, y) {
        return [this.x(this._getTooltipYear(x)), 0];
    }

    _getTotalFatalities(values) {
        if (!values) {
            return 0;
        }

        return d3.sum(values, (e) => {
            return parseInt(e.Fatalities);
        });
    }

    _getTotalFatalitiesGround(values) {
        if (!values) {
            return 0;
        }

        return d3.sum(values[0], (e) => {
            return e.Ground;
        })
            + d3.sum(values[1], (e) => {
                return e.Ground;
            });
    }

    _getTotalSurvivors(values) {
        if (!values) {
            return 0;
        }

        return d3.sum(values[0], (e) => {
            return e.Survivors;
        })
            + d3.sum(values[1], (e) => {
                return e.Survivors;
            });
    }

    _getCirclePositions(x, y) {
        return this._getValues(this._getTooltipYear(x))
            .map((values) => {
                return values ? this.y(this._getTotalFatalities(values)) : 0;
            });
    }

    _getValues(date) {
        const findYearIndex = (data) => {
            return data.values.findIndex((d) => {
                return d.key == date.getFullYear();
            });
        };

        if (this.data == null || date == null) {
            return [];
        }

        return this.data.map((d) => {
            const values = d.values[findYearIndex(d)];

            return values ? values.values : [];
        });
    }

    _getTooltipContent(d) {
        if (!d) {
            return "";
        }

        const values = this._getValues(d);
        return d.getFullYear()
            + "<br>" + "Nombre de morts civiles: " + this._getTotalFatalities(values[1])
            + "<br>" + "Nombre de morts militaires: " + this._getTotalFatalities(values[0])
            + "<br>" + "Nombre de morts (au sol): " + this._getTotalFatalitiesGround(values)
            + "<br>" + "Nombre de survivants: " + this._getTotalSurvivors(values);
    }
}