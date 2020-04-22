class Legend {
    constructor() {
        var svg = d3.select("#legend")
            .attr("width", 1200)
            .attr("height", 20)

        svg.append("circle").attr("cx", 60).attr("cy", 10).attr("r", 6).style("fill", "red")
        svg.append("circle").attr("cx", 200).attr("cy", 10).attr("r", 6).style("fill", "orange")
        svg.append("text").attr("x", 70).attr("y", 10).text("Militaire").style("font-size", "15px").attr("alignment-baseline", "middle")
        svg.append("text").attr("x", 210).attr("y", 10).text("Civil").style("font-size", "15px").attr("alignment-baseline", "middle")

    }


}