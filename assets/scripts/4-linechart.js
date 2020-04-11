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
    }

    initialize(crashes, periods) {
        domainX(this.x, crashes);
        this.y.domain([3000, 0])

        var data = d3.nest()
            .key(d => d.Date.getFullYear())
            .rollup(v => d3.sum(v, d => d.Fatalities))
            .object(crashes);

        var lineGroups = this.g.append("g")
            .attr("class", "context")
            .selectAll("g")
            .data([Object.entries(data)])
            .enter().append("g")

        lineGroups.append("path")
            .attr("class", "line")
            .attr("d", d => this.line(d))
            .attr("clip-path", "url(#linechart_clip)")
            .style("stroke", "black")
            .style("stroke-width", 1)
            .attr("id", d => "context" + d.Date);

        this.g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + this.rect.height + ")")
            .call(this.xAxis);

        this.g.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(0,0 )")
            .call(this.yAxis);

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
            .curve(d3.curveBasisOpen);
    }
}