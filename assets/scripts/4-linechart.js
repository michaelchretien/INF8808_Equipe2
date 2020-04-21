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
class LineChart {
    constructor(rect, svg) {
        this.rect = rect;
        this.x = d3.scaleTime()
            .range([0, rect.width]);

        this.y = d3.scaleLinear()
            .domain([0, rect.height])
            .range([0, rect.height]);

        this.g = svg.append("g")
            .attr("transform", "translate(" + rect.left + "," + rect.top + ")");

        this.line = this._createLine(this.x, this.y);
        this.xAxis = d3.axisBottom(this.x)//.tickFormat(localization.getFormattedDate);
        this.yAxis = d3.axisLeft(this.y);

        // Ajout d'un plan de découpage.
        svg.select("defs")
            .append("clipPath")
            .attr("id", "linechart_clip")
            .append("rect")
            .attr("width", this.rect.width)
            .attr("height", this.rect.height);

        this.tooltip = new Tooltip(this.g, this.rect)
        this.tooltip.getPosition = (x, y) => this._getTooltipPosition(x, y);
        this.tooltip.getCirclePosition = (x, y) => this._getCirclePositions(x, y);
        this.tooltip.getLinePosition = (x, y) => this._getLinePosition(x, y);
        this.tooltip.getContent = (d) => this._getTooltipContent(this.currentYear);
    }

    initialize(crashes, periods) {
        domainX(this.x, crashes);

        this.data = d3.nest()
            .key(d => d.Operator.includes("Military") ? "Militaire" : "Civil")
            .key(d => d.Date.getFullYear())
            .sortKeys(d3.descending)
            .entries(crashes);

        this._updateDomainY()

        var lineGroups = this.g.append("g")
            .attr("class", "context")
            .selectAll("g")
            .data(this.data.map(d => d.values))
            .enter().append("g")

        lineGroups.append("path")
            .attr("class", "line")
            .attr("d", d => this.line(d))
            .attr("clip-path", "url(#linechart_clip)")
            .style("pointer-events", "none")
            .style("stroke", "black")
            .style("stroke-width", 1)
            .attr("id", d => "context" + d.key);

        // Axe horizontal
        this.g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + this.rect.height + ")")
            .call(this.xAxis);

        // Titre axe horizontal
        this.g.append("text")
            .attr("transform",
                "translate(" + (this.rect.width - 5) + " ," +
                (this.rect.height - 6) + ")")
            .style("text-anchor", "end")
            .text("Date");

        // Axe vertical
        this.g.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(0,0 )")
            .call(this.yAxis);

        // Titre axe vertical
        this.g.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 6)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Nombre de décès");

        // Titre
        this.g.append("text")
            .attr("x", (this.rect.width / 2))
            .attr("y", -30)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text("Évolution du nombre de décès par année");
    }

    update(newDomain) {
        this.tooltip.hide()
        this.x.domain(d3.event.selection === null ? newDomain.domain() : d3.event.selection.map(newDomain.invert));
        this._updateDomainY()

        var line = this.line
        this.g.selectAll("path.line").attr("d", function (d) {
            return line(d)
        });

        this.g.select(".x.axis").call(this.xAxis);
        this.g.select(".y.axis").call(this.yAxis);

    }

    _updateDomainY() {
        var minYear = this.x.domain()[0].getFullYear(),
            maxYear = this.x.domain()[1].getFullYear();

        var max = 0
        for (var i = minYear; i <= maxYear; i++) {
            var values = this._getValues(parseYear(i))
            values.forEach(type =>
                max = d3.max([max, this._getTotalFatalities(type)])
            )
        }

        this.y.domain([max + 100, 0])
    }

    _createLine(x, y) {
        var parser = d3.timeParse("%Y");
        return d3.line()
            .x(d => x(parser(d.key)))
            .y(d => y(this._getTotalFatalities(d.values)))
            .curve(d3.curveMonotoneX);
    }

    _getTooltipYear(mousePosX) {
        var reversed_date = this.x.invert(mousePosX)
        this.currentYear = d3.timeParse("%Y")(reversed_date.getFullYear() + (reversed_date.getMonth() > 5 ? 1 : 0))
        return this.currentYear
    }

    _getLinePosition(x, y) {
        return [this.x(this._getTooltipYear(x)), 0]
    }

    _getTotalFatalities(values) {
        return d3.sum(values, e => parseInt(e.Fatalities))
    }

    _getTotalFatalitiesGround(values) {
        return d3.sum(values[0], e => e.Ground) + d3.sum(values[1], e => e.Ground)
    }

    _getTotalSurvivors(values) {
        return d3.sum(values[0], e => e.Survivors) + d3.sum(values[1], e => e.Survivors)
    }

    _getCirclePositions(x, y) {
        return this._getValues(this._getTooltipYear(x))
            .map(values => values ? this.y(this._getTotalFatalities(values)) : 0)
    }

    _getValues(date) {
        var findYearIndex = (data) => {
            return data.values.findIndex(d => d.key == date.getFullYear())
        }

        if (this.data == null)
            return []

        return this.data.map(
            d => {
                var values = d.values[findYearIndex(d)]
                return values ? values.values : []
            }
        )
    }

    _getTooltipContent(d) {
        // TODO ajouter plus de détail dans le tooltip
        var values = this._getValues(d)
        return d.getFullYear()
            + "<br>" + "Nombre de morts civiles: " + this._getTotalFatalities(values[1])
            + "<br>" + "Nombre de morts militaires: " + this._getTotalFatalities(values[0])
            + "<br>" + "Nombre de morts (au sol): " + this._getTotalFatalitiesGround(values)
            + "<br>" + "Nombre de survivants: " + this._getTotalSurvivors(values)
    }
}