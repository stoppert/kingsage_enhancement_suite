# Angriffe

<a name="attacks-by-second"></a>
#### Angriffe sekundengenau darstellen

+ KES berechnet an Hand der Serverzeit und des Zeitstempels der Angriffe die sekundengenaue Einschlagszeit

<a name="insert-into-runtimecalculator"></a>
#### Angriffe in Laufzeitrechner einfügen

> **Voraussetzungen** 

> + `Angriffe in Laufzeitrechner einfügen` muss in den Einstellungen aktiviert sein

**Funktionsweise**

+ Das Angriffssymbol in der ersten Spalte der Tabelle wird in einen Link umgewandelt
+ Klickt man diesen Link wird der Laufzeitrechner geöffnet und die Koordinaten sowie die Einschlagszeit werden übergeben

[Zur Dokumentation Laufzeitrechner](/docs/runtimecalculator)

<a name="save-attacks"></a>
#### Angriffe speichern

> **Voraussetzungen** 

> + `Angriffe speichern/Auf Karte hervorheben` muss in den Einstellungen aktiviert sein

**Funktionsweise**

+ "Diese Angriffe speichern" speichert alle Angriffe auf der Seite ab
+ Die angegriffenen Siedlungen werden auf der Karte markiert

[Zur Dokumentation Karte](/docs/map#show-attacks)

#### Alle Angriffe laden

+ Wenn mehrere Seiten voller Angriffe vorhanden sind lassen sich diese mit "Alle Angriffe laden" auf einer Seite anzeigen
+ Nachdem alle Angriffe geladen sind können diese gefiltert werden

siehe unten für weitere Informationen zum Angriffe filtern

#### Angriffe filtern

+ Es kann die Spalte mit Angreiferinformation oder mit Verteidigerinformationen durchsucht werden
+ Dazu muss entweder Angreifer oder Verteidiger ausgewählt werden (Standardmäßig ist Verteidiger ausgewählt)
+ In das Suchfeld lassen sich Spielername, Koordinaten, Allianz, Kontinent und Siedlungsname eingeben
+ Die Suche startet automatisch während man Eingabe vornimmt
+ Neben dem Suchfeld wird die Anzahl der Treffer angebeben
+ "Löschen" leert das Suchfeld und setzt die Ergebnisse zurück

