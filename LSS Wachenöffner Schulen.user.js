// ==UserScript==
// @name         LSS Wachenöffner Schulen
// @namespace    www.leitstellenspiel.de
// @version      1.0
// @description  Fügt einen Button ein um alle Wachen in der Schule zu öffnen
// @author       MissSobol
// @match        https://www.leitstellenspiel.de/buildings/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Funktion, um alle Panels zu öffnen
    function openAllPanels() {
        var panels = $(".panel-body");
        var index = 0;

        // Funktion für das Öffnen des nächsten Panels mit Verzögerung
        function openNextPanel() {
            if (index < panels.length) {
                var panel = panels.eq(index);
                var buildingId = panel.attr("building_id");

                panel.removeClass("hidden");

                // Überprüfen, ob das Panel bereits geladen wurde
                if (loadedBuildings.indexOf("/buildings/" + buildingId + "/schooling_personal_select") == -1) {
                    loadedBuildings.push("/buildings/" + buildingId + "/schooling_personal_select");

                    // Verzögerung vor dem Laden des Inhalts
                    setTimeout(function() {
                        $.get("/buildings/" + buildingId + "/schooling_personal_select", function(data) {
                            panel.html(data);

                            // Logik nach dem Laden des Inhalts

                            var education_key = $('input[name=education]:checked').attr("education_key");

                            if (typeof(education_key) == "undefined" && typeof(globalEducationKey) != "undefined") {
                                schooling_disable(globalEducationKey);
                            } else if (typeof(education_key) != "undefined") {
                                schooling_disable(education_key);
                                update_personnel_counter_navbar();
                            }

                            index++;
                            openNextPanel();
                        });
                    }, 100);
                } else {
                    index++;
                    openNextPanel();
                }
            }
        }

        // Aufrufen der Funktion, um das erste Panel zu öffnen
        openNextPanel();
    }

    // Funktion zum Hinzufügen des Buttons
    function addButton() {
        var allianceCost = $("#alliance_cost");

        // Überprüfen, ob das Element mit der ID "alliance_cost" vorhanden ist
        if (allianceCost.length > 0) {
            var button = $("<button>")
                .text("Alle Wachen öffnen")
                .attr("id", "openAllPanelsButton") 
                .addClass("btn btn-xs btn-default")
                .css({
                    "margin-left": "10px"
                })
                .click(function(event) {
                    event.preventDefault(); // Deaktiviere das Standardverhalten des Buttons
                    openAllPanels();
                });

            // Den Button neben das Element mit der ID "alliance_cost" einfügen
            allianceCost.after(button);
        }
    }

    // Auf das Dokument warten, bevor das Skript ausgeführt wird
    $(document).ready(function() {
        addButton();
    });
})();
