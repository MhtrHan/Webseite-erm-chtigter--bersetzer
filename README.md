# Mhtrian Übersetzungen – Website V2.0

## Lokal starten
Doppelklick auf `start-local.bat`, anschließend öffnet sich die Website unter `http://localhost:8080`.

## Änderungen in V1.6
- Telefonnummer und WhatsApp werden sichtbar im internationalen Format mit `+49` angezeigt.
- Telefonnummern bleiben auch in der arabischen RTL-Version korrekt von links nach rechts dargestellt.
- Auf der Seite „Leistungen“ heißt der Button im Bereich „Weitere Dokumente“ nun „Angebot anfordern“.
- Die beiden Buttons auf „Kostenvoranschlag anfordern“ sind auf Desktop sauber auf gleicher Höhe ausgerichtet.
- Beim Öffnen einer E-Mail wird automatisch eine Anfragenummer nach dem Muster `AJJJJMMTT-HHmm` erzeugt und in den Betreff aufgenommen.
- Der vorausgefüllte E-Mail-Text enthält echte Zeilenumbrüche.
- WhatsApp erhält eine Betreffzeile mit Anfragenummer und darunter einen mehrzeiligen Nachrichtentext.
- Alle hierfür sichtbaren Texte bleiben zentral in `assets/js/content.js` bearbeitbar.

## Hinweis zur Anfragenummer
In dieser schlanken Website-Version wird die Anfragenummer im Browser erzeugt. Sie wird noch nicht in einer Datenbank gespeichert. Die spätere Webanwendung wird die Nummer serverseitig erzeugen und dauerhaft der Anfrage zuordnen.


Version 1.7: Impressum und Datenschutzerklärung für die geplante Cloudflare-Veröffentlichung ergänzt. Hinweis: Vor dem Livegang prüfen, ob eine Umsatzsteuer-Identifikationsnummer oder Wirtschafts-Identifikationsnummer vorhanden ist; falls ja, muss sie im Impressum ergänzt werden.


## Änderungen in V2.0 (Redesign)
- Komplett neues Design: warmer Papierton, Petrol + Messing als Akzentfarben, Serifen-Überschriften, eigene Icons statt Emojis.
- Startseite mit Illustration einer beglaubigten Übersetzung (Stempel, Unterschrift), Leistungsübersicht mit Icons, Ablauf als Zeitleiste, Bearbeitungszeiten als große Kennzahlen, neues FAQ und Abschlussbereich.
- Neu gestaltete Unterseiten (Leistungen, Über mich mit „Auf einen Blick“, Kontakt, Angebot mit Checkliste, Rechtliches, 404).
- Arabische Version (RTL) mit passender Schrift und gespiegeltem Layout.
- Barrierefreiheit: Tastaturbedienung, „Zum Inhalt springen“, ARIA-Attribute für Menü und Kontakt-Button.
- Strukturierte Daten (schema.org) für Google auf der Startseite.
- Alle neuen Texte stehen ebenfalls in `assets/js/content.js` (DE + AR) und sollten vor Veröffentlichung geprüft werden.
