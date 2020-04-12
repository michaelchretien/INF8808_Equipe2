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
        this.tooltip.getContent = (d) => this._getTooltipContent(d);
    }

    initialize(crashes, periods) {
        domainX(this.x, crashes);
        this.y.domain([3000, 0])

        this.data = Object.entries(
            d3.nest()
                .key(d => d.Date.getFullYear())
                .rollup(v => d3.sum(v, d => d.Fatalities))
                .object(crashes)
        );

        var lineGroups = this.g.append("g")
            .attr("class", "context")
            .selectAll("g")
            .data([this.data])
            .enter().append("g")

        lineGroups.append("path")
            .attr("class", "line")
            .attr("d", d => this.line(d))
            .attr("clip-path", "url(#linechart_clip)")
            .style("pointer-events", "none")
            .style("stroke", "black")
            .style("stroke-width", 1)
            .attr("id", d => "context" + d.Date);

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

        var line = this.line
        this.g.selectAll("path.line").attr("d", function (d) {
            return line(d)
        });

        this.g.select(".x.axis").call(this.xAxis);
    }

    _createLine(x, y) {
        var parser = d3.timeParse("%Y");

        return d3.line()
            .defined(d => !isNaN(d[1]))
            .x(d => x(parser(d[0])))
            .y(d => y(d[1]))
            .curve(d3.curveMonotoneX);
    }

    _getTooltipPosition(x, y) {
        var parser = d3.timeParse("%Y");
        var bisectDate = d3.bisector(function (d) { return parser(d[0]); }).left

        var x0 = this.x.invert(x),
            i = bisectDate(this.data, x0, 1),
            d0 = this.data[i - 1],
            d1 = this.data[i],
            d = x0 - d0[0] > d1[0] - x0 ? d1 : d0;

        this.currentDataElement = d

        //console.log(d[0])
        //console.log(this.x(parser(d[0])), this.y(d[1]))
        return [this.x(parser(d[0])), this.y(d[1])]
    }

    _getTooltipContent(d) {
        // TODO ajouter plus de détail dans le tooltip
        return this.currentDataElement[0]
            + "<br>" + "Nombre de morts: " + this.currentDataElement[1]
    }
}