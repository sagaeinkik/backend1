# Moment 1 i kursen DT207G

## Backend-baserad webbutveckling

_Av Saga Einarsdotter Kikajon_

---

I denna uppgift skulle vi skapa en webbapplikation med hjälp av NodeJS och Express för att kunna lägga till kurser till valfri databas.

I uppgiftsbeskrivningen stod inte uttryckligen att man var tvungen att ha funktionalitet för att radera eller ändra kurser, men i målbeskrivningen antyddes det, så jag har lagt till funktionalitet för det också bara för säkerhets skull.

För att lösa uppgiften har jag använt mig av SQLite som databashanterare genom sqlite3. Jag har valt att inte publicera webbplatsen på render denna gång.

Så, jag har använt mig av följande för att lösa uppgiften:

-   Express som ramverk
-   Express' egna parsing
-   SQLite som databas
-   EJS som View Engine
-   Nodemon för utveckling
-   Dotenv för att lagra port
-   Drawio-extension i VSCode för ER-diagram

---

Jag har inkluderat en fil för att skapa databasen och tabellen (install.js) och en fil för att börja om med tabellen (reset.js) om man skulle göra om själv.
