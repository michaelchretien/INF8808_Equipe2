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
class Tooltip {
    constructor(g, rect) {
        this.parent = g
        this.g = g.append("g")
        //.attr("id", "tooltip")
        //.style("display", "none");

        this.g.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", rect.height)
            .style("stroke", "blue")

        this.tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-8, 0])
            .html(d => this.getContent(d));

        this.parent.call(this.tip);

        // append the rectangle to capture mouse       
        g.append("rect")
            .attr("width", rect.width)
            .attr("height", rect.height)
            .attr("fill", "none")
            .style("pointer-events", "all")
            .on('mouseover', d => this.show(d))
            .on('mouseout', d => this.hide(d))
            .on("mousemove", _ => this.mousemove());

        //this.show();
    }

    show(d) {
        this.tip.show(d, this.g.node())
        this.g.style("display", null)
    }

    hide(d) {
        this.tip.hide(d)
        this.g.style("display", "none")
    }

    getPosition(x, y) {
        // Override la méthode par les components pour 
        // fixer le tip sur une ligne par exemple
        return [x, y] // tipPos, linePos, circlePos
    }

    getContent(d) {
        return "default"
    }

    getLinePosition(x, y) {
        return [x, 0]
    }

    getCirclePosition(x, y) {
        return []
    }

    mousemove() {
        var [x, y] = d3.mouse(this.parent.node())
        var linePos = this.getLinePosition(x, y)
        this.g.attr("transform", "translate(" + linePos[0] + "," + linePos[1] + ")");
        this.show()

        var circles = this.g.selectAll("circle")
            .data(this.getCirclePosition(x, y))

        circles.exit().remove()

        circles.enter()
            .append("circle")
            .attr("class", "y")
            .style("fill", "none")
            .style("stroke", "blue")
            .attr("r", 4);

        circles.transition()
            .duration(0)
            .attr("cy", d => d)
    }
}