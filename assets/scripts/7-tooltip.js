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
        this.g = g
        this.tip = g.append("g")
            .attr("id", "tooltip")
            .style("display", "none");

        // Ajout du tooltip
        this.tip.append("circle")
            .attr("class", "y")
            .style("fill", "none")
            .style("stroke", "blue")
            .attr("r", 4);

        this.tool_tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-8, 0])
            .html(d => this.getContent(d));
        g.call(this.tool_tip);

        // append the rectangle to capture mouse       
        g.append("rect")
            .attr("width", rect.width)
            .attr("height", rect.height)
            .attr("fill", "none")
            .style("pointer-events", "all")
            .on('mouseover', d => {
                this.show()
                this.tool_tip.show(d, this.tip.node())
            })
            .on('mouseout', this.tool_tip.hide)
            .on("mousemove", _ => this.mousemove());

        //this.show();
    }

    show(content) {
        this.tip.style("display", null)
        console.log("show")
    }

    hide() {
        console.log("hide")
        this.tip.style("display", "none")
    }

    getPosition(x, y) {
        // Override la méthode par les components pour 
        // fixer le tip sur une ligne par exemple
        return [x, y]
    }

    getContent(d) {
        return "default"
    }

    mousemove() {
        var mousePos = d3.mouse(this.g.node())
        var fixedPos = this.getPosition(mousePos[0], mousePos[1])
        this.tip.attr("transform", "translate(" + fixedPos[0] + "," + fixedPos[1] + ")");
        this.tool_tip.show()
        //this.tool_tip.offset([-250, -50])
    }
}