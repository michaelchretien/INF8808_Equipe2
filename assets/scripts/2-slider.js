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
class Slider {
    constructor(rect, svg) {
        this.rect = rect;
        this.x = d3.scaleTime().range([0, rect.width]);
        this.y = d3.scaleLinear().range([rect.height, 0]);
        this.g = svg.append("g")
            .attr("transform", "translate(" + rect.left + "," + rect.top + ")");

        this.xAxis = d3.axisBottom(this.x).tickFormat(localization.getFormattedDate);
        this.svg = svg
    }

    initialize(crashes, periods) {
        /*this.brush = d3.brushX()
        .extent([[0, 0], [this.rect.width, this.rect.height]])
        .on("brush", () => this.onSelectionChanged())
        */
        domainX(this.x, crashes);
        this._addPeriods(periods)

        /*this.g.append("rect")
            .attr("width", this.rect.width)
            .attr("height", this.rect.height)
            .style("stroke", "black")
            .style("fill", "none")
            .style("stroke-width", 1)*/
        // Axes

        var range = this.x.domain()
        var x = this.x
        var height = this.rect.height
        var width = this.rect.width
        var g = this.g
        var svg = this.svg

        var parser = d3.timeParse("%Y");

        // draw background lines
        this.g.append('g').selectAll('line')
            .data(d3.range(range[0].getFullYear(), range[1].getFullYear() + 1))
            .enter()
            .append('line')
            .attr('x1', d => x(parser(d))).attr('x2', d => x(parser(d)))
            .attr('y1', 0).attr('y2', height)
            .style('stroke', '#ccc')

        /*var labelL = g.append('text')
        .attr('id', 'labelleft')
        .attr('x', 0)
        .attr('y', height + 5)
        .text(new Date(range[0]).getFullYear())
        
        var labelR = g.append('text')
        .attr('id', 'labelright')
        .attr('x', 0)
        .attr('y', height + 5)
        .text(new Date(range[1]).getFullYear())*/
        this.g.append("g")
            .attr("class", "x axis")
            //.attr("transform", "translate(0, 0)")
            .call(this.xAxis);

        var onSelectionChanged = () => this.onSelectionChanged()
        var brush = d3.brushX()
            .extent([[0, 0], [width, height]])
            .on('brush', function () {
                var s = d3.event.selection;
                // update and move labels
                /*labelL.attr('x', s[0])
                .text(Math.round(x.invert(s[0])))
                labelR.attr('x', s[1])
                .text(Math.round(x.invert(s[1])) - 1)*/
                // move brush handles      
                handle.attr("display", null).attr("transform", function (d, i) { return "translate(" + [s[i], - height / 4] + ")"; });
                // update view
                // if the view should only be updated after brushing is over, 
                // move these two lines into the on('end') part below
                svg.node().value = s.map(d => Math.round(x.invert(d)));
                svg.node().dispatchEvent(new CustomEvent("input"));
                onSelectionChanged()
            })
            .on('end', function () {
                if (!d3.event.sourceEvent) return;
                var d0 = d3.event.selection.map(x.invert);
                var d1 = d0.map(d => parser(d.getFullYear()))
                d3.select(this).transition().call(d3.event.target.move, d1.map(x))
            })

        var gBrush = g.append("g")
            .attr("class", "brush")
            .call(brush)

        var brushResizePath = function (d) {
            var e = +(d.type == "e"),
                x = e ? 1 : -1,
                y = height / 2;
            return "M" + (.5 * x) + "," + y + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6) + "V" + (2 * y - 6) +
                "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y) + "Z" + "M" + (2.5 * x) + "," + (y + 8) + "V" + (2 * y - 8) +
                "M" + (4.5 * x) + "," + (y + 8) + "V" + (2 * y - 8);
        }

        var handle = gBrush.selectAll(".handle--custom")
            .data([{ type: "w" }, { type: "e" }])
            .enter().append("path")
            .attr("class", "handle--custom")
            .attr("stroke", "#000")
            .attr("fill", '#eee')
            .attr("cursor", "ew-resize")
            .attr("d", brushResizePath);

        gBrush.selectAll(".overlay")
            .each(function (d) { d.type = "selection"; })
            .on("mousedown touchstart", brushcentered)

        function brushcentered() {
            /*var dx = x(1) - x(0), // Use a fixed width when recentering.
                cx = d3.mouse(this)[0],
                x0 = cx - dx / 2,
                x1 = cx + dx / 2;
            d3.select(this.parentNode).call(brush.move, x1 > width ? [width - dx, width] : x0 < 0 ? [0, dx] : [x0, x1]);*/
        }
        gBrush.call(brush.move, range.map(x))
    }

    _addPeriods(periods) {
        var height = this.rect.height;
        var x = this.x

        // Barres
        this.g.append("g").selectAll("period")
            .data(periods)
            .enter().append("rect")
            .attr("class", "period")
            .attr("x", d => x(d.StartDate))
            .attr("width", d => x(d.EndDate) - x(d.StartDate))
            .attr("height", height)
            .attr("clip-path", "url(#graphviz_clip)")
            .attr("fill", (d, i) => "hsl(" + (i * 80) + ",50%,75%)");

    }

    onSelectionChanged() {
        console.log("onSelectionChanged")
    }
}