import { Link } from "@tanstack/react-router";

import { ActionLink, PageShell, Section } from "@/components/layout/page-shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { localizedPath } from "@/config/site";
import { openCookiePreferences } from "@/features/privacy/components/cookie-consent";
import { useSiteLocale } from "@/features/site/client/site-location";
import * as m from "@/paraglide/messages.js";

export function CookiePage() {
  const locale = useSiteLocale();
  return (
    <PageShell
      hero={false}
      title={m.cookies_no_surprises_even_in_the_technical({}, { locale })}
      description={m.cookies_a_complete_policy_on_cookies_and({}, { locale })}
    >
      <Section>
        <div className="mx-auto max-w-4xl space-y-10 text-ink-body">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-overline-wide text-link">
              {m.cookies_cookie_policy({}, { locale })}{" "}
            </p>
            <h1 className="display-font mt-4 text-3xl font-semibold text-white sm:text-4xl">
              {m.cookies_cookies_and_other_tracking_technologies({}, { locale })}{" "}
            </h1>
            <p className="mt-4 text-lg leading-8 text-ink-body">
              {m.cookies_this_policy_supplements_the_privacy_notice({}, { locale })}{" "}
            </p>
          </div>

          <Alert>
            <AlertTitle>{m.cookies_current_consent_status({}, { locale })}</AlertTitle>
            <AlertDescription>
              {m.cookies_the_banner_distinguishes_necessary_technical_monitoring(
                {},
                { locale },
              )}{" "}
            </AlertDescription>
            <Button type="button" onClick={openCookiePreferences}>
              {m.cookies_change_preferences_7({}, { locale })}{" "}
            </Button>
          </Alert>

          <LegalSection
            title={m.cookies_what_cookies_and_tracking_technologies_are({}, { locale })}
          >
            <p>{m.cookies_cookies_are_small_text_strings_or({}, { locale })} </p>
            <p>{m.cookies_this_policy_also_covers_technologies_with({}, { locale })} </p>
          </LegalSection>

          <LegalSection title={m.cookies_controller_and_contact_details({}, { locale })}>
            <p>
              {m.cookies_the_data_controller_is({}, { locale })}{" "}
              <strong className="text-white">Vincenzo Prisco</strong>
              {m.cookies_for_the_personal_site({}, { locale })}{" "}
              <strong className="text-white">prisco.me</strong>
              {m.cookies_for_questions_or_requests_use_the({}, { locale })}{" "}
              <Link
                className="text-link underline decoration-link/40 underline-offset-4 hover:text-white"
                to="/contact"
              >
                {m.cookies_contact_page({}, { locale })}{" "}
              </Link>{" "}
              {m.cookies_or_the({}, { locale })}{" "}
              <a
                className="text-link underline decoration-link/40 underline-offset-4 hover:text-white"
                href="https://www.linkedin.com/in/vincenzoprisco/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              .
            </p>
            <p>{m.cookies_before_publishing_in_a_professional_capacity({}, { locale })} </p>
          </LegalSection>

          <LegalSection title={m.cookies_categories_of_technology({}, { locale })}>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                [
                  m.cookies_technical_tools({}, { locale }),
                  m.cookies_technical_tools_description({}, { locale }),
                ],
                [
                  m.cookies_analytics_tools({}, { locale }),
                  m.cookies_analytics_tools_description({}, { locale }),
                ],
                [
                  m.cookies_banner_preference({}, { locale }),
                  m.cookies_banner_preference_description({}, { locale }),
                ],
                [
                  m.cookies_third_party_services({}, { locale }),
                  m.cookies_third_party_description({}, { locale }),
                ],
              ].map(([title, body]) => (
                <Card key={title}>
                  <CardHeader>
                    <CardTitle>{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{body}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </LegalSection>

          <LegalSection title={m.cookies_technologies_used_on_this_site({}, { locale })}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{m.cookies_technology({}, { locale })}</TableHead>
                  <TableHead>{m.cookies_purpose({}, { locale })}</TableHead>
                  <TableHead>{m.cookies_activation({}, { locale })}</TableHead>
                  <TableHead>{m.cookies_duration({}, { locale })}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  [
                    m.cookies_technical_features({}, { locale }),
                    m.cookies_technical_purpose({}, { locale }),
                    m.cookies_necessary({}, { locale }),
                    m.cookies_session_duration({}, { locale }),
                  ],
                  [
                    "prisco-cookie-consent",
                    m.cookies_consent_storage({}, { locale }),
                    m.cookies_consent_activation({}, { locale }),
                    m.cookies_consent_duration({}, { locale }),
                  ],
                  [
                    "PostHog",
                    m.cookies_posthog_purpose({}, { locale }),
                    m.cookies_posthog_activation({}, { locale }),
                    m.cookies_posthog_duration({}, { locale }),
                  ],
                ].map(([name, purpose, activation, duration]) => (
                  <TableRow key={name}>
                    <TableCell>{name}</TableCell>
                    <TableCell>{purpose}</TableCell>
                    <TableCell>{activation}</TableCell>
                    <TableCell>{duration}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="text-sm">
              {m.cookies_the_names_and_lifetimes_of_identifiers({}, { locale })}{" "}
            </p>
          </LegalSection>

          <LegalSection title={m.cookies_posthog_and_optional_analytics({}, { locale })}>
            <p>{m.cookies_the_site_uses_posthog_to_monitor({}, { locale })} </p>
            <p>{m.cookies_storage_page_views_autocapture_and_session({}, { locale })} </p>
            <p>{m.cookies_consent_is_freely_given_specific_informed({}, { locale })} </p>
          </LegalSection>

          <LegalSection title={m.cookies_banner_choice_and_withdrawal({}, { locale })}>
            <p>{m.cookies_on_your_first_visit_the_banner({}, { locale })} </p>
            <p>{m.cookies_the_choice_is_stored_locally_in({}, { locale })} </p>
            <p>
              {m.cookies_to_change_your_choice_use_the({}, { locale })}{" "}
              <strong className="text-white">
                {m.cookies_change_preferences_36({}, { locale })}
              </strong>{" "}
              {m.cookies_button_on_this_page_it_clears({}, { locale })}{" "}
            </p>
          </LegalSection>

          <LegalSection title={m.cookies_legal_basis_and_consequences_of_refusal({}, { locale })}>
            <p>{m.cookies_strictly_necessary_tools_are_based_on({}, { locale })} </p>
            <p>{m.cookies_declining_or_withdrawing_consent_does_not({}, { locale })} </p>
          </LegalSection>

          <LegalSection title={m.cookies_external_services_and_transfers({}, { locale })}>
            <p>{m.cookies_pages_may_link_to_linkedin_github({}, { locale })} </p>
            <p>{m.cookies_if_technical_or_analytics_tools_transfer({}, { locale })} </p>
          </LegalSection>

          <LegalSection title={m.cookies_browser_controls({}, { locale })}>
            <p>{m.cookies_major_browsers_let_you_block_delete({}, { locale })} </p>
            <p>{m.cookies_instructions_vary_by_browser_and_device({}, { locale })} </p>
          </LegalSection>

          <LegalSection title={m.cookies_your_rights({}, { locale })}>
            <p>
              {m.cookies_for_personal_data_collected_through_tracking({}, { locale })}{" "}
              <Link
                className="text-link underline decoration-link/40 underline-offset-4 hover:text-white"
                to="/contact"
              >
                {m.cookies_contact_page({}, { locale })}{" "}
              </Link>
              .
            </p>
            <p>
              {m.cookies_you_may_lodge_a_complaint_with({}, { locale })}{" "}
              <a
                className="text-link underline decoration-link/40 underline-offset-4 hover:text-white"
                href="https://www.garanteprivacy.it/web/guest/home/docweb/-/docweb-display/docweb/9677876"
                target="_blank"
                rel="noreferrer"
              >
                {m.cookies_italian_data_protection_authority({}, { locale })}{" "}
              </a>
              .
            </p>
          </LegalSection>

          <LegalSection title={m.cookies_policy_updates({}, { locale })}>
            <p>{m.cookies_the_controller_may_update_this_notice({}, { locale })} </p>
            <p>
              <strong className="text-white">{m.cookies_last_updated({}, { locale })}</strong>{" "}
              {m.cookies_july({}, { locale })}{" "}
            </p>
          </LegalSection>

          <div className="flex flex-wrap gap-3 border-t border-white/10 pt-8">
            <Button type="button" variant="outline" onClick={openCookiePreferences}>
              {m.cookies_change_preferences({}, { locale })}{" "}
            </Button>
            <ActionLink href={localizedPath("/privacy", locale)} variant="secondary">
              {m.cookies_read_the_privacy_notice({}, { locale })}{" "}
            </ActionLink>
            <ActionLink href={localizedPath("/contact", locale)}>
              {m.cookies_contact_me({}, { locale })}
            </ActionLink>
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
      <div className="space-y-4 text-base leading-8">{children}</div>
    </section>
  );
}
