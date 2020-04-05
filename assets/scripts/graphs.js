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

// Dates des périodes historiques
var periodes = [[1, "Première guerre mondiale", 1914, 1918, "http://en.wikipedia.org/wiki/Xia_Dynasty"],
[2, "Deuxième guerre mondiale", 1939, 1945, "http://en.wikipedia.org/wiki/Shang_Dynasty"],
];

var debutFrise = 1908;
var finFrise = 2020;


"use strict";
class GraphViz {
    constructor(rect, svg) {
        this.rect = rect;
        this.x = d3.scaleLinear()
            .domain([debutFrise, finFrise])
            .range([0, rect.width]);

        this.y = d3.scaleLinear()
            .domain([0, rect.height])
            .range([0, rect.height]);

        this.g = svg.append("g")
            .attr("transform", "translate(" + rect.left + "," + rect.top + ")");

        //this.line = this.createLine(this.x, this.y);
        //this.xAxis = d3.axisBottom(this.x)//.tickFormat(localization.getFormattedDate);
        //this.yAxis = d3.axisLeft(this.y);

        // Ajout d'un plan de découpage.
        /*svg.select("defs")
            .append("clipPath")
            .attr("id", "graphviz_clip")
            .append("rect")
            .attr("x", 50)
            .attr("width", this.rect.width - 100)
            .attr("height", this.rect.height);*/
    }

    initialize(data, sources, color) {
        //domainX(this.x, this.x, data);
        //domainY(this.y, this.y, sources);

        this.g.append("rect")
            .attr("width", this.rect.width)
            .attr("height", this.rect.height)
            .style("stroke", "black")
            .style("fill", "none")
            .style("stroke-width", 1)

        /*var contextLineGroups = this.g.append("g")
            .attr("class", "context")
            .selectAll("g")
            .data(sources)
            .enter().append("g")

        contextLineGroups.append("path")
            .attr("class", "line")
            .attr("d", d => this.line(d.values))
            .attr("clip-path", "url(#graphviz_clip)")
            .style("stroke", d => (d.name === "Moyenne") ? "black" : color(d.name))
            .style("stroke-width", d => (d.name === "Moyenne") ? 2 : 1)
            .attr("id", d => "context" + d.name);*/

        var height = this.rect.height;
        var x = this.x
        // Affichage des périodes	
        this.g.append("g").selectAll("periode")
            .data(periodes)
            .enter().append("rect")
            .attr("class", "periode")
            .attr("x", function (d) { return x(d[2]); })
            //.attr("y", function (d) { return height - 4; })
            .attr("width", function (d) { return x(d[3]) - x(d[2]); })
            .attr("height", height)
            .attr("fill", function (d) { return "hsl(" + (360 - d[0] * 19) + ",50%,50%)" });

        this.g.append("g").selectAll(".nomPeriode")
            .data(periodes)
            .enter().append("a")
            .attr("xlink:href", function (d) { return d[4]; })
            .append("text")
            .text(function (d) { return d[1]; })
            .attr("class", "nomPeriode")
            .attr("id", function (d) { return "nomPeriode" + d[0]; })
            .attr("text-anchor", "middle")
            .attr("x", function (d) { return x((d[2] + d[3]) / 2); })
            .attr("y", function (d) { return height - 4 })
            .attr("dy", "1.5em")
            .attr("font-weight", "bold");
        /*this.g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (this.rect.height - 30) + ")")
            .call(this.xAxis);

        this.g.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(50,0 )")
            .call(this.yAxis);*/
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

    update(newDomain) {
        // TODO: Redessiner le graphique focus en fonction de la zone sélectionnée dans le graphique contexte.
        /*var line = this.line
        this.x.domain(d3.event.selection === null ? newDomain.domain() : d3.event.selection.map(newDomain.invert));
        this.g.selectAll("path.line").attr("d", function (d) {
            return line(d.values)
        });
        this.g.select(".x.axis").call(this.x);
        this.g.select(".y.axis").call(this.y);*/
    }

}