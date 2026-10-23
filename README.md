# Insieme — un passo alla volta

Una prima base per un sito di orientamento e supporto alle persone in difficoltà.
I testi e le aree di supporto sono segnaposto editoriali: non descrivono servizi
attivi, disponibilità o recapiti. Aggiornarli con le informazioni verificate
prima della pubblicazione.

## Anteprima locale

Apri `index.html` in un browser. Il sito è statico e non richiede installazione
di dipendenze o compilazione.

La pagina offre collegamenti rapidi ai numeri nazionali pubblici di emergenza e
ascolto e funzioni dimostrative che restano nella scheda corrente. L'uscita
rapida mostra una pagina vuota ma non cancella la cronologia del browser.

La chat interna mostra risposte predefinite in locale. Non è collegata a un
modello IA, a un operatore o ad altri utenti, non accetta testo libero e non
fornisce consulenza professionale. La chat interna tra utenti non è attiva. La
community include un popup informativo che appare all'apertura e si chiude dopo
12 secondi di inattività. Si può chiudere con il pulsante, il tasto Esc o un
clic fuori dal popup, oppure riaprire dalla sezione community. Il link WhatsApp
esterno è stato fornito dall'utente: verifica chi gestisce il gruppo prima di
unirti e non condividere informazioni sensibili.

Moduli per inviare o tracciare richieste, notifiche, dati territoriali, annunci
e community sono indicati come non ancora attivi: richiedono un ente responsabile,
fonti verificate e un servizio backend. Le note privacy presenti nella pagina
sono provvisorie e non costituiscono un'informativa GDPR.

## Struttura

- `index.html`: schermata e contenuti.
- `app/assets/styles.css`: interfaccia responsive.
- `app/assets/app.js`: navigazione e interazioni locali.

## Personalizzazione

- Aggiorna testi, domande frequenti e aree di supporto in `index.html`.
- Conferma i numeri di assistenza e i riferimenti del progetto prima della
  pubblicazione.
- Integra un backend e una revisione legale prima di raccogliere o trattare
  dati personali, attivare prenotazioni o pubblicare annunci.
- Colori, layout e comportamento responsive sono definiti in
  `app/assets/styles.css`.
- Le funzioni locali non sensibili sono gestite in `app/assets/app.js`;
  nickname e promemoria non vengono salvati oltre la durata della scheda.
