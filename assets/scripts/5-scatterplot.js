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

        // Ajout d'un plan de découpage
        svg.select("defs")
            .append("clipPath")
            .attr("id", "scatterplot_clip")
            .append("rect")
            .attr("width", this.rect.width)
            .attr("height", this.rect.height);
    }

    initialize(crashes, periods) {
        // TODO utiliser les classes css pour le style des axes, cercle, titres

        this.y.domain([0, 600]) // TODO récupérer la valeur max à partir du dataset
        domainX(this.x, crashes);

        var x = this.x
        var y = this.y

        // Titre
        this.g.append("text")
            .attr("x", (this.rect.width / 2))
            .attr("y", -30)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text("Nombre de décès par accident");

        // Axe horizontal
        this.g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + this.rect.height + ")")
            .call(this.xAxis);

        // Titre axe horizontal
        this.g.append("text")
            .attr("transform",
                "translate(" + this.rect.width + " ," +
                (this.rect.height + 20) + ")")
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
            .attr("y", 6)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Nombre de décès");

        // Points
        this.g.selectAll("dot")
            .data(crashes)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.Date))
            .attr("cy", d => y(d.Fatalities))
            .attr("clip-path", "url(#scatterplot_clip)")
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