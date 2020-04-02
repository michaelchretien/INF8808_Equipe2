"use strict";

/**
 * Fichier permettant de dessiner les graphiques "focus" et "contexte".
 */


/**
 * Crée une ligne SVG en utilisant les domaines X et Y spécifiés.
 * Cette fonction est utilisée par les graphiques "focus" et "contexte".
 *
 * @param x               Le domaine X.
 * @param y               Le domaine Y.
 * @return d3.svg.line    Une ligne SVG.
 *
 * @see https://bl.ocks.org/gordlea/27370d1eea8464b04538e6d8ced39e89      (voir line generator)
 */
function createLine(x, y) {
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

/**
 * Crée le graphique focus.
 *
 * @param g         Le groupe SVG dans lequel le graphique doit être dessiné.
 * @param sources   Les données à utiliser.
 * @param line      La fonction permettant de dessiner les lignes du graphique.
 * @param color     L'échelle de couleurs ayant une couleur associée à un nom de rue.
 */
function createFocusLineChart(g, sources, line, color) {
  // TODO: Dessiner le graphique focus dans le groupe "g".
  // Pour chacun des "path" que vous allez dessiner, spécifier l'attribut suivant: .attr("clip-path", "url(#clip)").
  var focusLineGroups = g.append("g")
    .attr("class", "focus")
    .selectAll("g")
    .data(sources)
    .enter()
    .append("g");

  focusLineGroups.append("path")
    .attr("class", "line")
    .attr("d", function (d) {
      return line(d.values);
    })
    .style("stroke", function (d) {
      return color(d.name);
    })
    .attr("clip-path", "url(#clip)")
    .style("stroke", function (d) {
      if (d.name === "Moyenne") {
        return "black"
      }
      return color(d.name);
    })
    .style("stroke-width", function (d) {
      if (d.name === "Moyenne") {
        return 2;
      }
      return 1;
    })
    .attr("value", function (d) {
      return d.name
    }).attr("id", function (d) {
      return "focus" + d.name;
    });
}

/**
 * Crée le graphique contexte.
 *
 * @param g         Le groupe SVG dans lequel le graphique doit être dessiné.
 * @param sources   Les données à utiliser.
 * @param line      La fonction permettant de dessiner les lignes du graphique.
 * @param color     L'échelle de couleurs ayant une couleur associée à un nom de rue.
 */
function createContextLineChart(g, sources, line, color) {
  // TODO: Dessiner le graphique contexte dans le groupe "g".
  var contextLineGroups = g.append("g")
    .attr("class", "context")
    .selectAll("g")
    .data(sources)
    .enter().append("g");

  contextLineGroups.append("path")
    .attr("class", "line")
    .attr("d", function (d) {
      return line(d.values);
    })
    .attr("clip-path", "url(#clip)")
    .style("stroke", function (d) {
      if (d.name === "Moyenne") {
        return "black"
      }
      return color(d.name);
    })
    .style("stroke-width", function (d) {
      if (d.name === "Moyenne") {
        return 2;
      }
      return 1;
    })
    .attr("id", function (d) {
      return "context" + d.name;
    });
}
