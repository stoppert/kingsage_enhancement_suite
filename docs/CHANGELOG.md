# Kingsage Enhancement Suite

## -1.2

## -1.1.5.3
+ add - angriffe sortieren übersicht/befehle/angriffe
+ add - generate real bbcode reports that make use of shorter kingsage bbcode instead of [img] bbcodes
+ fix - massbuild in av
+ fix - runtime calc eigene fahne zeigte für unterstützungen angriffssymbol an

## -1.1.5
+ add - trooplinks for overview<combined
+ add - runtimecalc für linke flagge
+ add - ignore atts via overview angriffe > nicht ignorierte
+ add - gruppen zuweisen auch von karte
+ fix - groups highlight was reset with every new version empty presets
+ fix - exporttarget war kaputt, overlay ging nicht
+ fix - gruppeneinteilen auf siedlungsansicht war teilweise in zwei zeilen
+ fix - alle aufträge abbrechen zeigte sich auch wenn abbrechen noch gar nicht erforscht war
+ fix - sekunden anzeigen war fehlerhaft bei angriffen die über 100 stunden entfernt waren
+ fix - gruppen zuteilen in üersicht ging unter chrome nicht

## -1.1.4
+ add - massenweiterleiten auch für nachrichten (nur ganze nachrichten!)
+ change - neue einstellungen
+ change - massbuild kann man nun ein und ausschalten
+ change - einstellugnen speichern automatisch
+ change - filterattacks wird nach angriffe laden einmal ausgeführt
+ fix - enter bei filterattacks führte zu seitenwechsel
+ fix - massenbauen zeigte nicht den korrekten resbedarf an wenn man sich in den modernen ansichten befand

## -1.1.3
+ add - massenbauen in der burg
+ add - alle abbrechen aufträge abbrechen in der burg
+ add - gruppenauswahl siedlungsübersicht
+ change - gruppen werden bei ändern gespeichert (übersicht)
+ change - selektoren sind nun die diesbezüglichen bilder
+ change - angriffsfilter filter nun bereits beim tippen
+ change - abkürzungen für truppen (karte) können nun selber bestimmt werden
+ fix - truppenpunkte ally nur mit premium möglich fixed
+ fix - truppenfilter sortierte mit rundungsfehlern
+ fix - laufzeitrechner funtkionierte nicht richtig
+ fix - Alle Angriffe anzeigen kann jetzt Laufzeitrechnerlink, sekundegenaue anzeige und wird nicht neugeladen wenn ein angriff durchläuft
+ fix - übersicht kombiniert sortieren funktioniert nun auch bei pagination
+ fix - textarearesize fix for google chrome oô

## -1.1.1
+ add - unterstützung für andere sprachen
+ add - target export
+ add - truppenfilter übersicht "ohne truppen" ignoriert laufzeiten und sucht nur nach passender truppen konfiguration
+ add - gruppenumbenennen ohne popup (übersicht gruppen umbenennen)
+ add - alle angriffe laden (kein ticker für neue atts, kein save kein angriffsplaner)
+ add - alle angriffe filtern nach angreifer/verteidiger namen, koords, siedlungsnamen, allianz
+ fix - research für uv

## - 1.1.0.9
+ fix - höhenproblem beim bb-code export
+ fix - bbcodeexport nur auf anfrage um siedlungen markierbar zu belassen und ladezeit zu verkürzen
+ add - übersicht eintreffend angriffe in sekunden
+ add - link zum thread bei bbcodexeport
+ add - truppenpunkte für allianz
+ add - more ui to autoresearch while working
+ fix - settings for small resolutions
+ add - batch mark support in inbox

## - 1.1.0.8.2
+ fix - forshcungen automatisieren wenn moderne ansicht verwendet wird.

## - 1.1.0.8.1
+ fix - forschungen automatisieren wenn forschung nicht möglih (kaserne, zu wenig res)

## - 1.1.0.8
+ change - gruppenmarkierungen farblich konfigurierbar (doku aktualisieren)
+ fix - Versionssprünge zerschiessen das script nicht mehr (hoffentlich)
+ add - Forschung automatisieren (doku)
+ add - Neue versionverwaltung
+ add - Simulator +25% und -25% klickbar (doku)
+ add - Script komplett in av nutzbar
+ add - Angriffe werden mit Sekundengenauigkeit angezeigt

## - 1.1.0.5.0
+ add - Selektoren (Berichttypen, Nachrichten etc.) für die Postfächer
+ add - Truppenpunkte werden im Spielerprofil angezeigt
+ change - Tooltips komplett aus den Einstellungen entfernt
+ fix - (bbCodeExport) Sortierung war teilweise falsch
+ fix - (bbCodeExport) Siedlungen mit führenden Nullen wurden nicht richtig verlinkt
+ fix - Kaserne - "Alle auswählen"-Button war kaputt
+ fix - Direktlinks auf den Spielerprofilen (Kundschafter, Kaserne, Burg) funktionierten nicht richtig
+ fix - Angriffe auf der Karte anzeigen funktionierte teilweise nicht

## - 1.1.0.4.2
+ fix bbcodeexport war kaputt
+ fix - postreihenfolge war manchmal falsch
+ fix - truppenlinks funktionierten nicht

## - 1.1.0.4.0
+ add - truppengattungen off,def,count,spy einzeln an/aus schaltbar
+ add - anzahl für truppengattungen hinzugefügt
+ add - hinweis das truppen anzeigen auf der karte nicht aktiviert ist (und daher die kes funktion auch nicht funktioniert)
+ change - bbcode export mehr konfigurationsmöglichkeiten
+ change - prüfung für truppenlinks in der kaserne ob mehr eingesetzt werden soll als da ist
+ fix - siedlugnen markieren (bbcode) verschiebt angriffs und unterstützungsbildchen
+ fix - truppen auf karte bei leerzeichen im nick fehlerhaft

## - 1.1.0.3
+ add - Laufzeiten bei Übersichten Kombiniert berechnet sich selber
+ add - Massenweiterleiten von Berichten
+ add - Truppenlinks für Schnellauswahl von Einheiten
+ fix - Text wird nicht markiert beim Siedlungen auswählen
+ fix - Truppenfilter funktionierte nicht bei mehr als 999 Siedlung auf einmal (bzw. mit umblättern)
+ fix - Truppen hervorheben funktioniert auch nach Siedlungswechsel über die Siedlungspfeile
+ add - Karte Angriffsinformationen wegklickbar

## - 1.1.0.1
+ fix - Markieren von Threads funktionierte nicht immer

## - version 1.1.0
+ add - Kundschafter können nun ebenfalls markiert werden
+ add - Grafen können nun ebenfalls markiert werden
+ add - Truppenfilter für Übersicht < Kombiniert
+ add - Siedlungen als BB-Code ins Forum posten
+ add - letztes Marktziel wird gespeichert und automatisch eingefügt
+ change - Mehrere Gruppen für Anzeige wählbar (z.B 1off, 2off wird beides auf der Karte mit off markiert)
+ change - Einstellungen komplett überarbeitet
+ fix - 0en einfügen in kaserne und angriffsplaner war buggy
+ fix - Direktlinks Burg und Kaserne in AV korrigiert


## - version 1.0.5
+ add – Simulator zeigt wieder komplette Einheiten an (5k -> 5.000 etc.)
+ add – Massenentlassen entlässt Einheiten die die eingestellten Werte überschreiten
+ add – Versionsnummer wird angezeigt
+ add – Einstellungen könnten zurückgesetzt werden (Hilft unter Umständen bei der Problembeseitigung)
+ fix – Angriffe auf der Karte anzeigen funktionierte in Google Chrome nicht
+ fix – Truppen auf Karte anzeigen optimiert
+ fix – Truppen hervorheben ohne Premium (Gruppe wird standardmäßig auf ‘Alle’ gesetzt)

## - version 1.02
+ fix – Rohstoffe verschicken funktionierte nicht mehr
+ fix – Durch update 2.0.0 ging das Truppenhervorheben nicht
+ fix – auch Grafen und Bauernmilizen lassen sich nun markieren

## - version 1.01
+ fix – Eingegebene Koordinaten werden wieder Null
+ fix – Einheiten anzeigen / speichern in Chrome

## - version 1.0
+ change – Funktionen an-, ausschaltbar
+ change – Angriffsdarstellung auf Karte übersichtlicher gemacht
+ change – Siedlungen mit Truppen werden nun anders gekennzeichnet (Punkt der entsprechenden Farbe oben Rechts bei jeder Siedlung)
+ change – Settings überarbeitet
+ change – Farbvorschau jetzt als Hintergrund der EIngabefelder
+ change – Voreinstellungen verbessert
+ add – Tooltips zur Beschreibung von Funktionen (beim auswählen eines Eingabefeldes)
+ add – Ab jetzt können 2 Einheiten ausgewählt werden um Def/Off Siedlungen zu markieren
+ add – Gespeicherte angriffe bereinigen sich von selbst, abgelaufene Angriffe werden gelöscht
+ fix – Einheiten entlassen meldete “Bitte gib die Koordinaten des Ziels ein.”

## - version 0.9
+ release
