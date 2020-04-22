"use strict";
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


var PALETTE = ["#B3E5FC", "#B2EBF2", "#B2DFDB", "#C8E6C9", "#DCEDC8","#F0F4C3","#FFF9C4","#FFECB3"]


/**
 * Convertit une année en string vers un objet Date
 */
function parseYear(year) {
    var parser = d3.timeParse("%Y");
    return parser(year)
}

/**
 * Convertit les champs en format Date
 */
function parseDate(data, fields = ["Date"]) {
    var parser = d3.timeParse("%m/%d/%Y");

    data.forEach(function (d) {
        fields.forEach(function (field) {
            d[field] = parser(d[field]);
        })
    });
}

/**
 * Initialise le domaine en fonction de l'étendue des dates d'accident
 */
function domainX(x, data) {
    x.domain(d3.extent(data, function (d) {
        return parseYear(d.Date.getFullYear());
    }));
}

/**
 * Précise le domaine des échelles utilisées par les graphiques "focus" et "contexte" pour l'axe Y.
 */
function domainY(y, data) {
    y.domain(d3.extent(data, function (d) {
        return d;
    }));
}
