import { createFileRoute, Link } from "@tanstack/react-router";

import { ActionLink, PageShell, Section } from "@/components/page-shell";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/privacy")({
  head: () =>
    pageHead({
      title: "Privacy | Prisco.me",
      description: "Informativa completa sul trattamento dei dati personali.",
      socialDescription: "Spazio personale di Vincenzo Prisco.",
      path: "/privacy",
    }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PageShell
      hero={false}
      title="I tuoi dati meritano chiarezza."
      description="Informativa sul trattamento dei dati personali effettuato tramite il sito personale prisco.me."
    >
      <Section>
        <div className="mx-auto max-w-4xl space-y-10 text-slate-300">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
              Informativa ai sensi del GDPR
            </p>
            <h1 className="display-font mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Informativa sul trattamento dei dati personali
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              La presente informativa descrive, con linguaggio chiaro ma giuridicamente completo,
              come vengono trattati i dati personali degli utenti che consultano il sito o inviano
              una richiesta tramite il modulo di contatto.
            </p>
          </div>

          <div className="rounded-2xl border border-sky-300/20 bg-sky-300/[0.06] p-6 text-sm leading-7">
            <p className="font-semibold text-white">Sintesi operativa</p>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>Il sito è un portfolio personale e non vende dati personali.</li>
              <li>
                Il conferimento dei dati nel modulo è volontario, ma alcuni campi sono necessari per
                poter rispondere alla richiesta.
              </li>
              <li>
                Gli strumenti di analisi, incluso PostHog, vengono caricati solo dopo una scelta
                positiva nel banner cookie.
              </li>
              <li>
                Le richieste degli interessati possono essere esercitate tramite la pagina{" "}
                <Link
                  className="text-sky-200 underline decoration-sky-300/40 underline-offset-4 hover:text-white"
                  to="/contact"
                >
                  Contatti
                </Link>
                .
              </li>
            </ul>
          </div>

          <LegalSection title="1. Identità e dati di contatto del titolare">
            <p>
              Il titolare del trattamento è <strong className="text-white">Vincenzo Prisco</strong>,
              in relazione al sito personale <strong className="text-white">prisco.me</strong> e ai
              relativi servizi digitali.
            </p>
            <p>
              Per comunicazioni sul trattamento dei dati, per esercitare i diritti previsti dalla
              normativa o per chiedere chiarimenti, l&apos;interessato può utilizzare il{" "}
              <Link
                className="text-sky-300 underline decoration-sky-300/40 underline-offset-4 hover:text-white"
                to="/contact"
              >
                modulo di contatto
              </Link>{" "}
              oppure il profilo{" "}
              <a
                className="text-sky-300 underline decoration-sky-300/40 underline-offset-4 hover:text-white"
                href="https://www.linkedin.com/in/vincenzoprisco/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              .
            </p>
            <p className="rounded-xl border border-amber-300/20 bg-amber-300/[0.06] p-4 text-sm text-amber-100/80">
              Prima della pubblicazione definitiva, il titolare deve completare questa sezione con
              un indirizzo email dedicato, un recapito postale e, ove applicabile, i dati fiscali o
              professionali richiesti dalla propria attività.
            </p>
            <p>
              Il titolare non ha indicato un responsabile della protezione dei dati (DPO), non
              essendo stata dichiarata una situazione che ne imponga la designazione.
            </p>
          </LegalSection>

          <LegalSection title="2. Ambito di applicazione e definizioni">
            <p>
              La presente informativa si applica alla navigazione sulle pagine pubbliche del sito,
              alla visualizzazione dei progetti e all&apos;invio di richieste tramite il form di
              contatto. Eventuali servizi esterni raggiungibili attraverso collegamenti ipertestuali
              sono soggetti alle informative dei rispettivi titolari.
            </p>
            <p>
              Per <em>dato personale</em> si intende qualsiasi informazione riguardante una persona
              fisica identificata o identificabile; per <em>trattamento</em> si intende qualsiasi
              operazione compiuta sui dati, come raccolta, registrazione, conservazione,
              consultazione, comunicazione o cancellazione.
            </p>
          </LegalSection>

          <LegalSection title="3. Categorie di dati personali trattati">
            <p>
              Il sito tratta esclusivamente i dati pertinenti rispetto alle finalità perseguite. Le
              categorie possono comprendere:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-white">Dati identificativi:</strong> nome e cognome o
                denominazione indicata dall&apos;utente.
              </li>
              <li>
                <strong className="text-white">Dati di contatto:</strong> indirizzo email e,
                facoltativamente, numero di telefono.
              </li>
              <li>
                <strong className="text-white">Dati professionali:</strong> azienda, progetto, ruolo
                o motivo del contatto, se forniti.
              </li>
              <li>
                <strong className="text-white">Contenuto della comunicazione:</strong> testo del
                messaggio e ogni informazione che l&apos;utente decide autonomamente di inserire.
              </li>
              <li>
                <strong className="text-white">Dati tecnici:</strong> indirizzo IP, informazioni del
                browser, sistema operativo, timestamp, URL richiesti e log tecnici, quando necessari
                per sicurezza, diagnostica e funzionamento.
              </li>
              <li>
                <strong className="text-white">Preferenze di consenso:</strong> scelta relativa agli
                strumenti di analisi, memorizzata localmente nel browser.
              </li>
            </ul>
            <p>
              Si invita l&apos;utente a non inserire nel modulo dati appartenenti a categorie
              particolari ai sensi dell&apos;articolo 9 del Regolamento (UE) 2016/679 o informazioni
              eccedenti rispetto alla richiesta. Qualora tali informazioni siano inviate
              spontaneamente, il titolare le tratterà solo nella misura strettamente necessaria a
              gestire la comunicazione e a tutelare i propri diritti.
            </p>
          </LegalSection>

          <LegalSection title="4. Origine dei dati e natura del conferimento">
            <p>
              I dati sono raccolti direttamente presso l&apos;interessato quando compila il modulo,
              quando utilizza il banner di consenso o quando interagisce con le pagine del sito.
              Alcuni dati tecnici sono generati automaticamente dal browser e dai sistemi
              infrastrutturali.
            </p>
            <p>
              Il conferimento dei dati contrassegnati come necessari nel modulo è indispensabile per
              inviare la richiesta e ricevere una risposta. Il mancato conferimento impedisce
              l&apos;invio o rende impossibile gestire la comunicazione. I campi facoltativi possono
              essere lasciati vuoti senza conseguenze sulla navigazione ordinaria.
            </p>
          </LegalSection>

          <LegalSection title="5. Finalità e basi giuridiche del trattamento">
            <div className="grid gap-4 sm:grid-cols-2">
              <PurposeCard
                title="Gestione delle richieste"
                body="Ricevere, protocollare, comprendere e riscontrare messaggi relativi a progetti, collaborazioni, consulenze o opportunità professionali."
                basis="Art. 6, par. 1, lett. b) GDPR: misure precontrattuali richieste dall'interessato."
              />
              <PurposeCard
                title="Ricontatto"
                body="Utilizzare i recapiti forniti per rispondere alla richiesta e proseguire la conversazione nei limiti del messaggio inviato."
                basis="Art. 6, par. 1, lett. a) GDPR: consenso espresso al ricontatto."
              />
              <PurposeCard
                title="Sicurezza e continuità"
                body="Prevenire abusi, attacchi, invii automatizzati e malfunzionamenti, nonché garantire disponibilità e integrità del servizio."
                basis="Art. 6, par. 1, lett. f) GDPR: legittimo interesse alla sicurezza del sito."
              />
              <PurposeCard
                title="Obblighi e tutela"
                body="Adempiere a obblighi di legge, accertare responsabilità, esercitare o difendere un diritto in sede giudiziaria o stragiudiziale."
                basis="Art. 6, par. 1, lett. c) e lett. f) GDPR, ove applicabili."
              />
              <PurposeCard
                title="Analisi facoltativa"
                body="Misurare in forma aggregata l'utilizzo del sito e migliorare contenuti e funzionalità tramite PostHog."
                basis="Art. 6, par. 1, lett. a) GDPR: consenso raccolto dal banner."
              />
            </div>
            <p>
              Il consenso agli strumenti di analisi è facoltativo e il rifiuto non impedisce
              l&apos;accesso alle pagine né l&apos;invio di una richiesta. Il consenso può essere
              revocato in qualsiasi momento tramite la pagina{" "}
              <Link
                className="text-sky-300 underline decoration-sky-300/40 underline-offset-4 hover:text-white"
                to="/cookie"
              >
                Cookie
              </Link>
              .
            </p>
          </LegalSection>

          <LegalSection title="6. Modalità di trattamento e misure di sicurezza">
            <p>
              Il trattamento è effettuato con strumenti informatici e procedure organizzative
              coerenti con le finalità indicate. Il titolare adotta misure ragionevoli per ridurre
              il rischio di accesso non autorizzato, perdita, alterazione o divulgazione dei dati,
              tenendo conto dello stato dell&apos;arte, dei costi di attuazione, della natura dei
              dati e del rischio per gli interessati.
            </p>
            <p>
              Le comunicazioni transitano attraverso connessioni cifrate quando supportate dal
              browser e dall&apos;infrastruttura. Le credenziali, le chiavi e i parametri di
              configurazione non devono essere inseriti nei contenuti pubblici o nei messaggi
              inviati al sito.
            </p>
            <p>
              Nessun sistema può garantire sicurezza assoluta: in caso di violazione rilevante il
              titolare valuterà gli obblighi di notifica all&apos;autorità di controllo e di
              comunicazione agli interessati previsti dal GDPR.
            </p>
          </LegalSection>

          <LegalSection title="7. Destinatari e categorie di soggetti autorizzati">
            <p>
              I dati possono essere conosciuti dal titolare e da persone autorizzate che abbiano
              necessità di accedervi per le finalità sopra indicate. Possono inoltre essere trattati
              da fornitori tecnologici nominati, ove necessario, responsabili del trattamento ai
              sensi dell&apos;articolo 28 GDPR.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>hosting, runtime e servizi edge necessari a pubblicare il sito;</li>
              <li>database e servizi di persistenza utilizzati per le richieste del modulo;</li>
              <li>
                servizi di monitoraggio degli errori e sicurezza, attivati per diagnosticare
                incidenti;
              </li>
              <li>
                CMS headless e servizi collegati alla pubblicazione degli articoli, se coinvolti
                nella richiesta effettuata dall&apos;utente;
              </li>
              <li>
                strumenti analitici, esclusivamente dopo il consenso, secondo la configurazione
                descritta nella policy cookie.
              </li>
            </ul>
            <p>
              I dati non sono diffusi, ceduti per finalità commerciali o utilizzati per inviare
              pubblicità personalizzata. Potranno essere comunicati a pubbliche autorità, consulenti
              o professionisti quando ciò sia imposto dalla legge o necessario per esercitare un
              diritto.
            </p>
          </LegalSection>

          <LegalSection title="8. Trasferimenti verso Paesi terzi">
            <p>
              Alcuni fornitori tecnologici possono operare con infrastrutture o subfornitori situati
              al di fuori dello Spazio Economico Europeo. Qualora il trattamento comporti un
              trasferimento internazionale, esso sarà effettuato nel rispetto del Capo V GDPR, sulla
              base di una decisione di adeguatezza, di clausole contrattuali standard, di misure
              supplementari o di altro meccanismo previsto dalla normativa applicabile.
            </p>
            <p>
              Il titolare verifica periodicamente i fornitori e la configurazione dei servizi.
              L&apos;elenco dei fornitori effettivamente attivati e dei relativi meccanismi di
              trasferimento deve essere mantenuto aggiornato in relazione all&apos;ambiente di
              produzione.
            </p>
          </LegalSection>

          <LegalSection title="9. Periodi e criteri di conservazione">
            <p>
              I dati sono conservati per un periodo non superiore a quello necessario rispetto alle
              finalità per cui sono stati raccolti, salvo ulteriori obblighi di legge o esigenze di
              accertamento, esercizio o difesa di diritti.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-white">Richieste di contatto:</strong> fino alla gestione
                della richiesta e della conseguente conversazione; successivamente solo per il tempo
                necessario a dimostrare l&apos;adempimento, gestire un rapporto professionale o
                rispettare obblighi applicabili.
              </li>
              <li>
                <strong className="text-white">Dati tecnici e log:</strong> per il periodo
                necessario a sicurezza, troubleshooting e rilevazione di abusi, secondo la
                configurazione dell&apos;hosting e dei servizi di osservabilità.
              </li>
              <li>
                <strong className="text-white">Preferenze cookie:</strong> fino alla modifica o
                cancellazione della scelta da parte dell&apos;utente e per il periodo utile a
                documentare la preferenza.
              </li>
              <li>
                <strong className="text-white">Analisi:</strong> secondo la configurazione di
                PostHog, il consenso prestato e i periodi indicati nella documentazione del servizio
                effettivamente utilizzato.
              </li>
            </ul>
            <p>
              Decorso il periodo applicabile, i dati vengono cancellati, anonimizzati o resi
              altrimenti non riconducibili all&apos;interessato, ove tecnicamente possibile.
            </p>
          </LegalSection>

          <LegalSection title="10. Processi decisionali automatizzati e profilazione">
            <p>
              Il sito non adotta decisioni basate esclusivamente su trattamenti automatizzati che
              producano effetti giuridici o incidano in modo analogo significativamente
              sull&apos;interessato. Il titolare non effettua profilazione per finalità
              pubblicitarie. Gli eventuali strumenti analitici sono utilizzati per metriche di
              utilizzo e miglioramento del sito, esclusivamente dopo consenso.
            </p>
          </LegalSection>

          <LegalSection title="11. Diritti dell'interessato">
            <p>Nei casi previsti dagli articoli 15-22 GDPR, l&apos;interessato può chiedere:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>accesso ai dati personali e alle informazioni sul relativo trattamento;</li>
              <li>rettifica dei dati inesatti o integrazione di quelli incompleti;</li>
              <li>cancellazione dei dati, quando ricorrono i presupposti di legge;</li>
              <li>limitazione del trattamento nei casi previsti dall&apos;articolo 18 GDPR;</li>
              <li>
                portabilità dei dati forniti, nei casi e nei limiti dell&apos;articolo 20 GDPR;
              </li>
              <li>opposizione al trattamento fondato sul legittimo interesse;</li>
              <li>
                revoca del consenso, senza pregiudicare la liceità del trattamento precedente.
              </li>
            </ul>
            <p>
              Le richieste devono essere sufficientemente specifiche da consentire
              l&apos;identificazione dell&apos;interessato e possono essere inviate tramite la
              pagina{" "}
              <Link
                className="text-sky-300 underline decoration-sky-300/40 underline-offset-4 hover:text-white"
                to="/contact"
              >
                Contatti
              </Link>
              . Il titolare risponderà nei termini previsti dall&apos;articolo 12 GDPR, dopo aver
              verificato l&apos;identità del richiedente quando necessario.
            </p>
            <p>
              L&apos;interessato ha inoltre diritto di proporre reclamo al Garante per la protezione
              dei dati personali o a un&apos;altra autorità di controllo competente. Maggiori
              informazioni sono disponibili sul sito del{" "}
              <a
                className="text-sky-300 underline decoration-sky-300/40 underline-offset-4 hover:text-white"
                href="https://www.garanteprivacy.it/"
                target="_blank"
                rel="noreferrer"
              >
                Garante Privacy
              </a>
              .
            </p>
          </LegalSection>

          <LegalSection title="12. Minori">
            <p>
              Il sito non è rivolto specificamente a minori di età inferiore a 14 anni e il titolare
              non intende raccogliere consapevolmente dati di minori. Qualora un genitore o
              esercente la responsabilità genitoriale ritenga che un minore abbia trasmesso dati,
              può contattare il titolare per richiederne la cancellazione.
            </p>
          </LegalSection>

          <LegalSection title="13. Collegamenti a siti di terzi">
            <p>
              Le pagine possono contenere collegamenti a LinkedIn, GitHub, servizi di terzi o
              risorse esterne. L&apos;apertura del collegamento comporta l&apos;accesso a un
              ambiente soggetto all&apos;informativa e alle condizioni del relativo gestore. Il
              titolare non controlla le pratiche privacy dei siti esterni e non ne assume
              responsabilità.
            </p>
          </LegalSection>

          <LegalSection title="14. Modifiche all'informativa">
            <p>
              Il titolare può modificare la presente informativa per adeguarla a variazioni
              normative, tecniche o organizzative. La versione pubblicata sul sito è quella vigente;
              le modifiche sostanziali saranno evidenziate, ove ragionevolmente possibile, con un
              aggiornamento della data e dei contenuti.
            </p>
            <p>
              <strong className="text-white">Ultimo aggiornamento:</strong> 13 luglio 2026.
            </p>
          </LegalSection>

          <div className="flex flex-wrap gap-3 border-t border-white/10 pt-8">
            <ActionLink href="/cookie" variant="secondary">
              Leggi la policy cookie
            </ActionLink>
            <ActionLink href="/contact">Contattami</ActionLink>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="display-font text-2xl font-semibold text-white">{title}</h2>
      <div className="space-y-4 text-[0.98rem] leading-8">{children}</div>
    </section>
  );
}

function PurposeCard({ title, body, basis }: { title: string; body: string; basis: string }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
      <h3 className="display-font text-lg font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">{body}</p>
      <p className="mt-4 border-t border-white/10 pt-3 text-xs leading-6 text-sky-200/80">
        {basis}
      </p>
    </article>
  );
}
