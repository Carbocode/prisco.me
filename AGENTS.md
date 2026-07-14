# Regole per l'interfaccia

## Sezioni funzionali

Tutte le sezioni funzionali dell'applicazione devono utilizzare obbligatoriamente i componenti shadcn disponibili nel progetto. Questa regola si applica, tra le altre, a form, selettori, liste e tabelle.

In queste sezioni:

- utilizzare direttamente i componenti shadcn appropriati;
- non racchiudere i componenti shadcn in wrapper custom;
- non sovrascrivere, estendere o personalizzare lo stile dei componenti shadcn;
- non ricreare con HTML o componenti custom un elemento già disponibile come componente shadcn.

Sono escluse da questa regola esclusivamente le sezioni di tipo landing page, hero e showcase, per le quali è consentita una composizione visiva personalizzata.
