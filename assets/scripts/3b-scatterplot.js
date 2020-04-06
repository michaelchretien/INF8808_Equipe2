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
class ScatterPlot {
    constructor(rect, svg) {
        this.rect = rect;
        this.g = svg.append("g")
            .attr("transform", "translate(" + rect.left + "," + rect.top + ")");

        this.x = d3.scaleTime()
            .range([0, rect.width]);

        this.y = d3.scaleLinear()
            .range([this.rect.height, 0]);

        this.xAxis = d3.axisBottom(this.x).tickFormat(localization.getFormattedDate);
        this.yAxis = d3.axisLeft(this.y);
    }

    initialize(crashes, periods) {
        this.y.domain([0, 600]) // TODO get actual max value from crashes
        domainX(this.x, crashes);

        var x = this.x
        var y = this.y

        this.g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + this.rect.height + ")")
            .call(this.xAxis);

        this.g.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(0, 0)")
            .call(this.yAxis);

        this.g.selectAll("dot")
            .data(crashes)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.Date))
            .attr("cy", d => y(d.Fatalities))
            .attr("clip-path", "url(#graphviz_clip)")
            .attr("r", 1.5)
            .style("fill", "black")
    }

    update(newDomain) {
        this.x.domain(d3.event.selection === null ? newDomain.domain() : d3.event.selection.map(newDomain.invert));

        var x = this.x
        var y = this.y

        this.g.selectAll("circle")
            .attr("cx", d => x(d.Date))
            .attr("cy", d => y(d.Fatalities))
        this.g.select(".x.axis").call(this.xAxis);
    }
}