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
class Timeline {
    constructor(rect, svg) {
        this.rect = rect;
        this.x = d3.scaleTime().range([0, rect.width]);
        this.y = d3.scaleLinear().range([rect.height - 30, 0]);
        this.g = svg.append("g")
            .attr("transform", "translate(" + rect.left + "," + rect.top + ")");

        this.line = this.createLine(this.x, this.y);
        this.xAxis = d3.axisBottom(this.x).tickFormat(localization.getFormattedDate);
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

    initialize(data, sources, color) {
        this.brush = d3.brushX()
            .extent([[0, 0], [this.rect.width, this.rect.height]])
            .on("brush", () => this.onSelectionChanged())

        domainX(this.x, this.x, data);
        domainY(this.y, this.y, sources);

        this.g.append("rect")
            .attr("width", this.rect.width)
            .attr("height", this.rect.height)
            .style("stroke", "black")
            .style("fill", "green")
            .style("stroke-width", 1)

        var focusLineGroups = this.g.append("g")
            .attr("class", "focus")
            .selectAll("g")
            .data(sources)
            .enter()
            .append("g");

        focusLineGroups.append("path")
            .attr("class", "line")
            .attr("d", d => this.line(d.values))
            .style("stroke", d => color(d.name))
            .attr("clip-path", "url(#clip)")
            .style("stroke", d => (d.name === "Moyenne") ? "black" : color(d.name))
            .style("stroke-width", d => (d.name === "Moyenne") ? 2 : 1)
            .attr("value", d => d.name)
            .attr("id", d => "focus" + d.name);
        // Axes
        this.g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (this.rect.height - 30) + ")")
            .call(this.xAxis);

        this.g.append("g")
            .attr("class", "x brush")
            .call(this.brush)
            .selectAll("rect")
            .attr("y", -6)
            .attr("height", this.rect.height);
    }

    onSelectionChanged() {
        console.log("onSelectionChanged")
    }
}