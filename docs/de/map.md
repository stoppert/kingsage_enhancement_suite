# Karte

#### Truppen auf Karte anzeigen

> **Voraussetzungen** 

> + `Truppen hervorheben` muss in den Einstellungen aktiviert sein
> + Die Fähighkeit Truppen auf der Karte anzeigen zu lassen muss beim Alchemisten erforscht und aktiviert sein

**Funktionsweise**

+ In den Einstellungen lassen sich für Offensivtruppen, Defensivtruppen, Grafen und Kundschafter Einstellungen vornehmen
	+ Farbe
	+ Symbol
	+ Anzahl und Truppengattung
+ Eingestellte Werte bestimmen ob eine Siedung my Symbol und Farbe markiert wird (Ob die Anzahl der gewählten Truppengattung erreicht wird)
+ Die 4 Marker lassen sich einzeln An und Ausschalten

#### Gruppen auf Karte anzeigen

> **Voraussetzungen** 

> + `Gruppen hervorheben` muss in den Einstellungen aktiviert sein

**Funktionsweise**

+ In den Einstellungen lassen sich Gruppen in zwei Bereichte unterteilen
+ Angedacht ist z.B eine Unterteilung in Offensivgruppen und Defensivgruppen
+ Ist eine Siedlung Teil der ausgewählten Gruppe wird sie entsprechend markiert
+ Die Markierung ist unabhängig von den vorhandenen Truppen

<a name="show-attacks"></a>
#### Angriffe auf Karte hervorheben

> **Voraussetzungen** 

> + `Angriffe auf Karte hervorheben` muss in den Einstellungen aktiviert sein
> + Es müssen aktuell laufende Angriffe gespeichert sein [Wie speichert man Angriffe?]()

**Funktionsweise**

+ Sind im Kartenauschnitt angegriffene Siedlungen vorhande werden diese markiert
+ Bewegt man die Maus über eine markierte Siedlung erscheint ein Popup
+ Das Popup enthält Informationen über alle gespeicherten Angriffe die auf die Siedlung laufen
	+ Zahl der Angriffe
	+ Nächster Einschlag
	+ Angreifer
	+ Angreifer Siedlung

+ Angriffe die bereits angekommen sind werden automatisch von der List der gespeicherten Angriffe entfernt

#### Ziel aus Kartenauschnitt auswählen

> **Voraussetzungen** 

> + `Ziel aus Kartenauschnitt auswählen` muss in den Einstellungen aktiviert sein

**Funktionsweise**

+ KES fügt oberhalb der Karte ein Formular ein
+ In das Textfeld kann ein Spielername eingegeben werden (korrekt Schreibweise beachten!)
+ Es können per Checkbox nur Verlassene Siedlungen ausgewählt werden
+ Die Ausgabe kann per Checkbox in BB-Code umgewandelt werden
+ Der "Target Export"-Button erzeugt die Ausgabe der ausgewählten Siedlungen

#### Gruppen via Karte setzen

> **Voraussetzungen** 

> + `Gruppen via Karte setzen` muss in den Einstellungen aktiviert sein

**Funktionsweise**

+ KES fügt oberhalb der Karte ein Dropdown Menü sowie einen Button ein
+ Es kann eine beliebige - bereits existierende - Gruppe ausgewählt werden
+ Klickt man den Button werden alle eigenen Siedlungen innerhalb des aktiven Kartenausschnitts zur ausgewählten Gruppe hinzugefügt
