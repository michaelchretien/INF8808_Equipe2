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
 * Basé sur le code de https://observablehq.com/@sarah37/snapping-range-slider-with-d3-brush
 */
class Slider {
    constructor(rect, svg) {
        this.rect = rect;
        this.x = d3.scaleTime().range([0, rect.width]);
        this.y = d3.scaleLinear().range([rect.height, 0]);
        this.g = svg.append("g")
            .attr("transform", "translate(" + rect.left + "," + rect.top + ")");

        this.xAxis = d3.axisBottom(this.x).tickFormat(localization.getFormattedDate);
        this.svg = svg;

        this._lastUpdate = Date.now();
        this._isLiveUpdate = false;
    }

    initialize(crashes, periods) {
        domainX(this.x, crashes);
        this._addPeriods(periods)


        var range = this.x.domain()
        var x = this.x
        // Line pour chaque années
        this.g.append('g').selectAll('line')
            .data(d3.range(range[0].getFullYear(), range[1].getFullYear() + 1))
            .enter()
            .append('line')
            .attr('x1', d => this.x(parseYear(d))).attr('x2', d => x(parseYear(d)))
            .attr('y1', 0).attr('y2', this.rect.height)
            .style('stroke', '#ccc')

        // Axe contenant les années
        this.g.append("g")
            .attr("class", "x axis")
            .call(this.xAxis);

        // Ajout du brush
        var onSelectionChanged = () => this.onSelectionChanged();
        var setLiveUpdate = (enabled) => this._isLiveUpdate = enabled;

        var brush = d3.brushX()
            .extent([[0, 0], [this.rect.width, this.rect.height]])
            .on('brush', () => {
                var s = d3.event.selection;
                handle.attr("display", null)
                    .attr("transform", (d, i) => "translate(" + [s[i], - this.rect.height / 4] + ")");

                // const now = Date.now();
                // if (now - this._lastUpdate > 100) {
                //     this.onSelectionChanged();
                //     this._lastUpdate = now;
                // }
                if(this._isLiveUpdate)
                    onSelectionChanged()
            })
            .on('end', function () {
                if (!d3.event.sourceEvent) return;
                var d0 = d3.event.selection.map(x.invert);
                var d1 = d0.map(d => parseYear(d.getFullYear()))
                d3.select(this)
                    .transition()
                    .call(d3.event.target.move, d1.map(x))
                    .on("start", _ => setLiveUpdate(true))
                    .on("end", _ => setLiveUpdate(false));
            })

        var gBrush = this.g.append("g")
            .attr("class", "brush")
            .call(brush)

        var handle = gBrush.selectAll(".handle--custom")
            .data([{ type: "w" }, { type: "e" }])
            .enter().append("path")
            .attr("class", "handle--custom")
            .attr("stroke", "#000")
            .attr("fill", '#eee')
            .attr("cursor", "ew-resize")
            .attr("d", d => this._getBrushResizePath(d));

        gBrush.selectAll(".overlay")
            .each(function (d) { d.type = "selection"; })
            .on("mousedown touchstart")

        gBrush.call(brush.move, range.map(x))
    }

    _getBrushResizePath(d) {
        var e = +(d.type == "e"),
            x = e ? 1 : -1,
            y = this.rect.height / 2;
        return "M" + (.5 * x) + "," + y + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6) + "V" + (2 * y - 6) +
            "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y) + "Z" + "M" + (2.5 * x) + "," + (y + 8) + "V" + (2 * y - 8) +
            "M" + (4.5 * x) + "," + (y + 8) + "V" + (2 * y - 8);
    }

    _addPeriods(periods) {
        this.g.append("g").selectAll("period")
            .data(periods)
            .enter().append("rect")
            .attr("class", "period")
            .attr("x", d => this.x(d.StartDate))
            .attr("width", d => this.x(d.EndDate) - this.x(d.StartDate))
            .attr("height", this.rect.height)
            .attr("clip-path", "url(#graphviz_clip)")
            .attr("fill", (d, i) => "hsl(" + (i * 80) + ",50%,75%)");

    }

    onSelectionChanged() {
        // Overide cette méthode dans le main
    }
}