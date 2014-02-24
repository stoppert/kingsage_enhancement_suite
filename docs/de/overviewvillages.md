# Übersicht

## Kombiniert

#### Truppenfilter

> **Voraussetzungen** 

> + `Truppenfilter mit Ankunftszeit für Übersicht>Kombiniert` muss in den Einstellungen aktiviert sein

**Funktionsweise**

+ Es lassen sich folgenden Angaben machen
	+ benötigte Truppen
	+ Ziel
	+ Laufzeit
+ Laufzeit kann mit "Ohne Laufzeit" ignoriert werden
+ Abspeichern speichert die Einstellung für zukünftige Suchen
+ Truppenlinks fügen die in den Einstellungen gespeicherten Truppenkapazitäten in die Truppenanforderungen ein
+ "Filtern" überprüft für jede Siedlung
	+ ob sie innerhalb der vorgegebenen Laufzeit am Ziel eintreffen kann
	+ ob genügend Truppen vorhanden sind
+ Siedlungen auf die die Kriterien nicht zutreffen werden ausgeblendet
+ Für alle übrigen Siedlungen wird eine Spalte mit Laufzeit erstellt
+ Die Lauzfzeit ist ein Link zur Kaserne
+ Folgt man diesem Link werden die Truppenangaben übernommen so das der Angriff/die Unterstützung sofort ageschickt werden kann


## Forschung

#### Automatisiertes Forschen

+ "Fehlende Truppen erforschen" löst fehlende Forschungen in jeder Siedlung der aktuellen Seite aus
+ Ein Fehlermeldung zeigt an wenn keine fehlenden Forschungen gefunden wurden
+ Nachdem alle Forschungen in Auftrag gegeben wurden wird die Seite neu geladen
+ Alle Forschungen die nicht ausgeführt wurden benötigen entweder Ressourcen oder die Voraussetzungen wurden noch nicht erfüllt

## Truppen > Unterstützungen

#### Unterstützungen zurückrufen

+ Ein Link ermöglicht es alle Unterstüzungen die in einer bestimmten Siedlung stehen zu markieren
+ Zurückrufen ruft alle markierten Unterstützungen wie gewphnt zurück
+ Markierungen können über den Seitenwechsel hinaus gespeichert werden

## Befehle > Angriffe

> **Voraussetzungen** 

> + `Eigene Angriffe sortieren` muss in den Einstellungen aktiviert sein

**Funktionsweise**

+ "Eigene Angriffe sortieren" erzeugt eine Liste die alle Angriffe auf eine Sieldung in einer Zeile zusammenfasst
+ Es wird die Anzahl der Angriffe angezeigt (In Klammern Angriffe mit Grafen)
+ Es wird der erste und letzte Einschlag aufgelistet

Eigene Angriffe sortieren hilft zum Beispiel dabei Übersicht über eine große Offensivaktion zu bewahren.
Es ist sofort ersichtlich ob z.B zu wenige Angriffe mit Grafen verschickt wurden.

## Eintreffend

#### Angriffe sekundengenau anzeigen

Zu finden unter [Angriffe sekundengenau anzeigen](/docs/attacks#attacks-by-second)

#### Angriffe in Laufzeitrechner einfügen

Zu finden unter [Angriffe in Laufzeitrechner einfügen](/docs/runtimecalculator#insert-into-runtimecalculator)

## Eintreffend > Nicht-Ignorierte

#### Angriffe ignorieren

+ Jedem Angriff wird eine Checkbox hinzugefügt
+ Es können per Checkbox in der letzten Zeile alle Angriffe markiert werden
+ "Ignorieren" ignoriert alle markierten Angriffe

Diese Funktion ermöglicht es zentral Angriffe in mehreren Siedlungen zu ignorieren ohne die entsprechenden Kasernen aufrufen zu müssen

## Gruppen

+ "bearbeiten" wird durch "x Gruppen ausgewählt" ersetzt
+ Klickt man auf den eingefügten Link wird eine Liste geöffnet in der alle vorhandenen Gruppen aufgelistet sind
+ Per Checkbox können Gruppen aus oder abgewählt werden
+ Die Änderungen werden automatisch gespeichert


