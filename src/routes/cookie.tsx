import { createFileRoute, Link } from "@tanstack/react-router";

import { openCookiePreferences } from "@/components/cookie-consent";
import { ActionLink, PageShell, Section } from "@/components/page-shell";

export const Route = createFileRoute("/cookie")({
  head: () => ({
    meta: [
      { title: "Cookie | Prisco.me" },
      {
        name: "description",
        content:
          "Informativa completa sui cookie e sugli strumenti di tracciamento utilizzati da Prisco.me.",
      },
      { property: "og:title", content: "Cookie | Prisco.me" },
      {
        property: "og:description",
        content: "Categorie, finalità, consenso e gestione degli strumenti di tracciamento.",
      },
    ],
    links: [{ rel: "canonical", href: "https://prisco.me/cookie" }],
  }),
  component: CookiePage,
});

function CookiePage() {
  return (
    <PageShell
      hero={false}
      eyebrow="Cookie e tracciamento"
      title="Niente sorprese, nemmeno nei dati tecnici."
      description="Informativa completa sui cookie e sugli strumenti di tracciamento che possono essere utilizzati durante la navigazione."
    >
      <Section>
        <div className="mx-auto max-w-4xl space-y-10 text-slate-300">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
              Informativa cookie
            </p>
            <h1 className="display-font mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Cookie e altri strumenti di tracciamento
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              La presente informativa integra l&apos;informativa privacy e descrive le tecnologie
              utilizzate dal sito, le finalità perseguite e le modalità con cui l&apos;utente può
              esprimere, rifiutare o modificare il consenso.
            </p>
          </div>

          <div className="rounded-2xl border border-sky-300/20 bg-sky-300/[0.06] p-6 text-sm leading-7">
            <p className="font-semibold text-white">Stato attuale del consenso</p>
            <p className="mt-3">
              Il banner distingue gli strumenti necessari da quelli analitici. Il codice PostHog non
              viene inizializzato prima di una scelta positiva dell&apos;utente. Il rifiuto non
              limita la consultazione delle pagine o l&apos;invio del modulo di contatto.
            </p>
            <button
              className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
              type="button"
              onClick={openCookiePreferences}
            >
              Modifica le preferenze
            </button>
          </div>

          <LegalSection title="1. Cosa sono cookie e strumenti di tracciamento">
            <p>
              I cookie sono stringhe di testo o identificatori che un sito può memorizzare nel
              dispositivo dell&apos;utente, nel browser o in tecnologie equivalenti. Possono
              consentire al gestore di riconoscere una sessione, ricordare una preferenza, garantire
              la sicurezza oppure misurare l&apos;utilizzo di una pagina.
            </p>
            <p>
              La presente informativa comprende anche strumenti diversi dai cookie che producono
              effetti analoghi, come identificatori locali, script, pixel, SDK o tecnologie di
              misurazione installate nel browser.
            </p>
          </LegalSection>

          <LegalSection title="2. Titolare e riferimenti">
            <p>
              Il titolare del trattamento è <strong className="text-white">Vincenzo Prisco</strong>,
              per il sito personale <strong className="text-white">prisco.me</strong>. Per domande o
              richieste è possibile utilizzare la pagina{" "}
              <Link
                className="text-sky-300 underline decoration-sky-300/40 underline-offset-4 hover:text-white"
                to="/contatti"
              >
                Contatti
              </Link>{" "}
              o il profilo{" "}
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
            <p>
              Prima della messa online in un contesto professionale, il titolare deve completare i
              dati di contatto ufficiali, inclusi email e recapito postale, nella policy e nelle
              impostazioni del banner.
            </p>
          </LegalSection>

          <LegalSection title="3. Categorie di strumenti">
            <div className="grid gap-4 sm:grid-cols-2">
              <CookieCard
                title="Strumenti tecnici"
                body="Sono necessari a fornire la pagina richiesta, mantenere la sicurezza, gestire la sessione o ricordare una scelta tecnica. Quando sono strettamente necessari, vengono utilizzati senza consenso preventivo."
                tone="sky"
              />
              <CookieCard
                title="Strumenti analitici"
                body="Servono a comprendere, in forma aggregata o pseudonimizzata, come vengono utilizzate le pagine e quali contenuti migliorare. Sono attivati soltanto dopo il consenso."
                tone="violet"
              />
              <CookieCard
                title="Preferenza del banner"
                body="La scelta accettata o rifiutata viene salvata nel localStorage del browser con una chiave tecnica del sito, così da non ripresentare il banner a ogni pagina."
                tone="emerald"
              />
              <CookieCard
                title="Servizi di terzi"
                body="Un collegamento esterno, come LinkedIn o GitHub, può applicare le proprie tecnologie quando l'utente abbandona il sito. Il relativo trattamento è disciplinato dal gestore esterno."
                tone="slate"
              />
            </div>
          </LegalSection>

          <LegalSection title="4. Strumenti presenti nel progetto">
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="border-b border-white/10 text-xs uppercase tracking-[0.18em] text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Strumento</th>
                    <th className="px-5 py-4 font-semibold">Finalità</th>
                    <th className="px-5 py-4 font-semibold">Attivazione</th>
                    <th className="px-5 py-4 font-semibold">Durata</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-slate-300">
                  <CookieRow
                    name="Funzioni tecniche del sito"
                    purpose="Navigazione, sicurezza, rendering e gestione delle richieste."
                    activation="Necessaria"
                    duration="Sessione o secondo configurazione tecnica."
                  />
                  <CookieRow
                    name="prisco-cookie-consent"
                    purpose="Memorizzazione della scelta effettuata nel banner."
                    activation="Quando viene effettuata una scelta."
                    duration="Fino a modifica o cancellazione locale."
                  />
                  <CookieRow
                    name="PostHog"
                    purpose="Analisi aggregate dell'utilizzo e miglioramento del sito."
                    activation="Solo dopo consenso esplicito."
                    duration="Secondo la configurazione del servizio."
                  />
                </tbody>
              </table>
            </div>
            <p className="text-sm">
              I nomi e la durata di eventuali identificatori generati dai fornitori possono cambiare
              in base all&apos;ambiente di produzione, alla versione del loro SDK e alle
              impostazioni adottate. Il titolare deve mantenere questa tabella aggiornata quando
              cambia la configurazione effettivamente pubblicata.
            </p>
          </LegalSection>

          <LegalSection title="5. PostHog e analisi facoltativa">
            <p>
              Il progetto può utilizzare PostHog come strumento di product analytics. L&apos;SDK
              viene montato dall&apos;applicazione soltanto quando il valore di consenso analitico è
              <em>accepted</em>; in assenza di scelta o in caso di rifiuto il provider non viene
              inizializzato.
            </p>
            <p>
              L&apos;analisi può riguardare pagine visitate, eventi tecnici, informazioni sul
              dispositivo, referrer e interazioni con le funzionalità, nella misura prevista dalla
              configurazione. Non deve essere utilizzata per finalità pubblicitarie o per
              identificare una persona oltre quanto necessario alla metrica dichiarata.
            </p>
            <p>
              Il consenso è libero, specifico, informato e revocabile. La revoca non rende illeciti
              i trattamenti eseguiti prima della revoca.
            </p>
          </LegalSection>

          <LegalSection title="6. Banner, scelta e revoca">
            <p>
              Al primo accesso, il banner informa l&apos;utente sulla presenza di strumenti tecnici
              e analitici e propone due azioni distinte: rifiutare l&apos;analisi oppure accettarla.
              Nessuna opzione è preselezionata e la prosecuzione della navigazione non equivale a
              consenso.
            </p>
            <p>
              La scelta viene memorizzata localmente nel browser. Se l&apos;utente rifiuta, gli
              strumenti analitici rimangono disattivati. Se accetta, PostHog viene inizializzato
              dopo l&apos;aggiornamento dello stato dell&apos;applicazione.
            </p>
            <p>
              Per modificare la scelta, l&apos;utente può utilizzare il pulsante{" "}
              <strong className="text-white">Modifica le preferenze</strong> presente in questa
              pagina. L&apos;operazione cancella la preferenza locale e riapre il banner. È inoltre
              possibile cancellare i dati del sito dalle impostazioni del browser.
            </p>
          </LegalSection>

          <LegalSection title="7. Base giuridica e conseguenze del rifiuto">
            <p>
              Gli strumenti strettamente necessari si fondano sulla necessità di fornire il servizio
              richiesto dall&apos;utente e, ove applicabile, sul legittimo interesse alla sicurezza.
              Gli strumenti analitici si fondano sul consenso ai sensi dell&apos;articolo 6,
              paragrafo 1, lettera a), del Regolamento (UE) 2016/679 e delle norme nazionali
              applicabili.
            </p>
            <p>
              Il rifiuto o la revoca del consenso non comportano limitazioni alla consultazione del
              portfolio, del blog, delle pagine progetto o al contatto tramite modulo, salvo
              eventuali funzioni tecniche strettamente necessarie.
            </p>
          </LegalSection>

          <LegalSection title="8. Servizi esterni e trasferimenti">
            <p>
              Le pagine possono contenere collegamenti a LinkedIn, GitHub o altri domini. Il
              semplice collegamento non equivale all&apos;accettazione dei cookie del sito esterno;
              l&apos;eventuale trattamento inizia secondo le modalità del gestore terzo quando
              l&apos;utente apre la risorsa.
            </p>
            <p>
              Qualora gli strumenti tecnici o analitici comportino trasferimenti di dati fuori dallo
              Spazio Economico Europeo, il titolare deve verificare la presenza di una base
              giuridica e di garanzie adeguate ai sensi del Capo V GDPR, come descritto
              nell&apos;informativa privacy.
            </p>
          </LegalSection>

          <LegalSection title="9. Gestione tramite browser">
            <p>
              I principali browser consentono di bloccare, cancellare o limitare cookie e dati
              locali. La disabilitazione degli strumenti tecnici può compromettere alcune funzioni
              del sito; la disabilitazione degli strumenti analitici non impedisce la navigazione.
            </p>
            <p>
              Le istruzioni dipendono dal browser e dal dispositivo utilizzato. L&apos;utente può
              consultare la sezione privacy e sicurezza del proprio browser oppure cancellare i dati
              associati al dominio prisco.me.
            </p>
          </LegalSection>

          <LegalSection title="10. Diritti dell'interessato">
            <p>
              Per i dati personali raccolti tramite strumenti di tracciamento, l&apos;utente può
              esercitare i diritti di accesso, rettifica, cancellazione, limitazione, opposizione,
              portabilità e revoca del consenso nei casi previsti dagli articoli 15-22 GDPR. Le
              richieste possono essere inviate tramite la pagina{" "}
              <Link
                className="text-sky-300 underline decoration-sky-300/40 underline-offset-4 hover:text-white"
                to="/contatti"
              >
                Contatti
              </Link>
              .
            </p>
            <p>
              L&apos;interessato può proporre reclamo al Garante per la protezione dei dati
              personali. Le linee guida ufficiali sono disponibili sul sito del{" "}
              <a
                className="text-sky-300 underline decoration-sky-300/40 underline-offset-4 hover:text-white"
                href="https://www.garanteprivacy.it/web/guest/home/docweb/-/docweb-display/docweb/9677876"
                target="_blank"
                rel="noreferrer"
              >
                Garante Privacy
              </a>
              .
            </p>
          </LegalSection>

          <LegalSection title="11. Aggiornamenti della policy">
            <p>
              Il titolare può aggiornare la presente informativa in caso di modifiche alla
              configurazione del sito, ai fornitori, alla normativa o alle finalità perseguite. La
              versione pubblicata è quella vigente e riporta la data dell&apos;ultimo aggiornamento.
            </p>
            <p>
              <strong className="text-white">Ultimo aggiornamento:</strong> 13 luglio 2026.
            </p>
          </LegalSection>

          <div className="flex flex-wrap gap-3 border-t border-white/10 pt-8">
            <button
              className="inline-flex h-10 items-center justify-center rounded-md border border-white/20 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
              type="button"
              onClick={openCookiePreferences}
            >
              Modifica preferenze
            </button>
            <ActionLink href="/privacy" variant="secondary">
              Leggi la privacy
            </ActionLink>
            <ActionLink href="/contatti">Contattami</ActionLink>
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

function CookieCard({
  title,
  body,
  tone,
}: {
  title: string;
  body: string;
  tone: "sky" | "violet" | "emerald" | "slate";
}) {
  const toneClasses = {
    sky: "border-sky-300/20 bg-sky-300/[0.06]",
    violet: "border-violet-300/20 bg-violet-300/[0.06]",
    emerald: "border-emerald-300/20 bg-emerald-300/[0.06]",
    slate: "border-white/10 bg-white/[0.035]",
  } as const;

  return (
    <article className={["rounded-2xl border p-5", toneClasses[tone]].join(" ")}>
      <h3 className="display-font text-lg font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">{body}</p>
    </article>
  );
}

function CookieRow({
  name,
  purpose,
  activation,
  duration,
}: {
  name: string;
  purpose: string;
  activation: string;
  duration: string;
}) {
  return (
    <tr>
      <td className="px-5 py-4 font-semibold text-white">{name}</td>
      <td className="px-5 py-4 leading-6">{purpose}</td>
      <td className="px-5 py-4 leading-6">{activation}</td>
      <td className="px-5 py-4 leading-6">{duration}</td>
    </tr>
  );
}
