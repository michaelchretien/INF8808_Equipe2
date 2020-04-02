"use strict";

/**
 * Fichier permettant de générer la légende et de gérer les interactions de celle-ci.
 */


/**
 * Crée une légende à partir de la source.
 *
 * @param svg       L'élément SVG à utiliser pour créer la légende.
 * @param sources   Données triées par nom de rue et par date.
 * @param color     Échelle de 10 couleurs.
 */
function legend(svg, sources, color) {
  // TODO: Créer la légende accompagnant le graphique.
  var legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(70,30)")
    .style("font-size", "12px");

  // Affiche un carré de la même couleur que la ligne qui lui correspond
  legend.selectAll("rect")
    .data(sources)
    .enter()
    .append("rect")
    .attr("fill", function (d) {
      if (d.name === "Moyenne") {
        return "black"
      }
      return color(d.name);
    })
    .attr("stroke", "black")
    .attr("width", 10)
    .attr("height", 10)
    .attr("y", function (d, i) {
      return i * 25;
    })
    .attr("value", function (d) {
      return d.name;
    })
    .on("click", function() {
      displayLine(d3.select(this), color);
    });

  // Affiche un texte à droite du carré de couleur pour lier le nom de la rue à une couleur
  legend.selectAll("text")
    .data(sources).enter()
    .append("text")
    .attr("y", function (d, i) {
      return 8 + i * 25;
    })
    .attr("x", 20)
    .text(function (d) {
      return d.name;
    });

}

/**
 * Permet d'afficher ou non la ligne correspondant au carré qui a été cliqué.
 *
 * En cliquant sur un carré, on fait disparaitre/réapparaitre la ligne correspondant et l'intérieur du carré
 * devient blanc/redevient de la couleur d'origine.
 *
 * @param element   Le carré qui a été cliqué.
 * @param color     Échelle de 10 couleurs.
 */
function displayLine(element, color) {
  // TODO: Compléter le code pour faire afficher ou disparaître une ligne en fonction de l'élément cliqué.
  var pathContext = "#context" + element.attr("value");
  var pathFocus = "#focus" + element.attr("value");
  if (element.attr("fill") === "white") {
    element.attr("fill", function () {
      if (element.attr("value") === "Moyenne") {
        return "black"
      }
      return color(element.attr("value"))
    });
    d3.select(pathContext).style("opacity", 1);
    d3.select(pathFocus).style("opacity", 1);
  } else {
    element.attr("fill", "white");
    d3.select(pathContext).style("opacity", 0);
    d3.select(pathFocus).style("opacity", 0);
  }
}
