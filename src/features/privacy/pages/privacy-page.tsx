import { Link } from "@tanstack/react-router";

import { ActionLink, PageShell, Section } from "@/components/layout/page-shell";
import { localizedPath } from "@/config/site";
import { useSiteLocale } from "@/features/site/client/site-location";
import * as m from "@/paraglide/messages.js";

export function PrivacyPage() {
  const locale = useSiteLocale();
  return (
    <PageShell
      hero={false}
      title={m.privacy_your_data_deserves_clarity({}, { locale })}
      description={m.privacy_privacy_notice_for_personal_data_processed({}, { locale })}
    >
      <Section>
        <div className="mx-auto max-w-4xl space-y-10 text-ink-body">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-overline-wide text-link">
              {m.privacy_gdpr_privacy_notice({}, { locale })}{" "}
            </p>
            <h1 className="display-font mt-4 text-3xl font-semibold text-white sm:text-4xl">
              {m.privacy_privacy_notice_for_the_processing_of({}, { locale })}{" "}
            </h1>
            <p className="mt-4 text-lg leading-8 text-ink-body">
              {m.privacy_this_notice_explains_how_personal_data({}, { locale })}{" "}
            </p>
          </div>

          <div className="rounded-2xl border border-link/20 bg-link/6 p-6 text-sm leading-7">
            <p className="font-semibold text-white">{m.privacy_at_a_glance({}, { locale })}</p>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>{m.privacy_this_is_a_personal_portfolio_and({}, { locale })}</li>
              <li>{m.privacy_providing_data_in_the_form_is({}, { locale })} </li>
              <li>{m.privacy_posthog_monitors_errors_and_web_vitals({}, { locale })} </li>
              <li>
                {m.privacy_you_can_exercise_your_rights_through({}, { locale })}{" "}
                <Link
                  className="text-link-hover underline decoration-link/40 underline-offset-4 hover:text-white"
                  to="/contact"
                >
                  {m.privacy_contact_page({}, { locale })}{" "}
                </Link>
                .
              </li>
            </ul>
          </div>

          <LegalSection title={m.privacy_identity_and_contact_details_of_the({}, { locale })}>
            <p>
              {m.privacy_the_data_controller_is({}, { locale })}{" "}
              <strong className="text-white">Vincenzo Prisco</strong>
              {m.privacy_in_relation_to_the_personal_website({}, { locale })}{" "}
              <strong className="text-white">prisco.me</strong>{" "}
              {m.privacy_and_its_associated_digital_services({}, { locale })}{" "}
            </p>
            <p>
              {m.privacy_to_ask_about_data_processing_exercise({}, { locale })}{" "}
              <Link
                className="text-link underline decoration-link/40 underline-offset-4 hover:text-white"
                to="/contact"
              >
                {m.privacy_contact_form({}, { locale })}{" "}
              </Link>{" "}
              {m.privacy_or_the({}, { locale })}{" "}
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
            <p className="rounded-xl border border-warm-accent/20 bg-warm-accent/6 p-4 text-sm text-warm-ink-soft/80">
              {m.privacy_before_final_publication_the_controller_must({}, { locale })}{" "}
            </p>
            <p>{m.privacy_the_controller_has_not_designated_a({}, { locale })} </p>
          </LegalSection>

          <LegalSection title={m.privacy_scope_and_definitions({}, { locale })}>
            <p>{m.privacy_this_notice_covers_browsing_the_public({}, { locale })} </p>
            <p>
              {m.privacy_a({}, { locale })} <em>{m.privacy_personal_data({}, { locale })}</em>{" "}
              {m.privacy_means_any_information_about_an_identified({}, { locale })}{" "}
              <em>{m.privacy_processing({}, { locale })}</em>{" "}
              {m.privacy_means_any_operation_performed_on_such({}, { locale })}{" "}
            </p>
          </LegalSection>

          <LegalSection title={m.privacy_categories_of_personal_data_processed({}, { locale })}>
            <p>{m.privacy_the_site_processes_only_data_relevant({}, { locale })} </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-white">
                  {m.privacy_identification_data({}, { locale })}
                </strong>{" "}
                {m.privacy_the_name_or_business_name_supplied({}, { locale })}{" "}
              </li>
              <li>
                <strong className="text-white">{m.privacy_contact_details({}, { locale })}</strong>{" "}
                {m.privacy_email_address_and_optionally_telephone_number({}, { locale })}{" "}
              </li>
              <li>
                <strong className="text-white">
                  {m.privacy_professional_information({}, { locale })}
                </strong>{" "}
                {m.privacy_company_project_role_or_reason_for({}, { locale })}{" "}
              </li>
              <li>
                <strong className="text-white">
                  {m.privacy_communication_content({}, { locale })}
                </strong>{" "}
                {m.privacy_the_message_text_and_any_other({}, { locale })}{" "}
              </li>
              <li>
                <strong className="text-white">{m.privacy_technical_data({}, { locale })}</strong>{" "}
                {m.privacy_ip_address_browser_information_operating_system({}, { locale })}{" "}
              </li>
              <li>
                <strong className="text-white">
                  {m.privacy_consent_preferences({}, { locale })}
                </strong>{" "}
                {m.privacy_the_analytics_choice_stored_locally_in({}, { locale })}{" "}
              </li>
            </ul>
            <p>{m.privacy_please_avoid_submitting_special_categories_of({}, { locale })} </p>
          </LegalSection>

          <LegalSection title={m.privacy_source_of_data_and_provision_of({}, { locale })}>
            <p>{m.privacy_data_is_collected_directly_from_you({}, { locale })} </p>
            <p>{m.privacy_fields_marked_as_required_are_necessary({}, { locale })} </p>
          </LegalSection>

          <LegalSection title={m.privacy_purposes_and_legal_bases_for_processing({}, { locale })}>
            <div className="grid gap-4 sm:grid-cols-2">
              <PurposeCard
                title={m.privacy_handling_requests({}, { locale })}
                body={m.privacy_receive_record_understand_and_respond_to({}, { locale })}
                basis={m.privacy_article_b_gdpr_steps_taken_at({}, { locale })}
              />
              <PurposeCard
                title={m.privacy_responding_to_you({}, { locale })}
                body={m.privacy_use_the_contact_details_you_provide({}, { locale })}
                basis={m.privacy_article_a_gdpr_explicit_consent_to({}, { locale })}
              />
              <PurposeCard
                title={m.privacy_security_and_continuity({}, { locale })}
                body={m.privacy_prevent_abuse_attacks_automated_submissions_and({}, { locale })}
                basis={m.privacy_article_f_gdpr_legitimate_interest_in({}, { locale })}
              />
              <PurposeCard
                title={m.privacy_legal_obligations_and_protection_of_rights({}, { locale })}
                body={m.privacy_meet_legal_obligations_establish_liability_and({}, { locale })}
                basis={m.privacy_article_c_and_f_gdpr_where({}, { locale })}
              />
              <PurposeCard
                title={m.privacy_optional_analytics({}, { locale })}
                body={m.privacy_measure_site_use_in_aggregate_and({}, { locale })}
                basis={m.privacy_article_a_gdpr_consent_obtained_through({}, { locale })}
              />
            </div>
            <p>
              {m.privacy_analytics_consent_is_optional_declining_it({}, { locale })}{" "}
              <Link
                className="text-link underline decoration-link/40 underline-offset-4 hover:text-white"
                to="/cookie"
              >
                {m.privacy_cookies_page({}, { locale })}{" "}
              </Link>
              .
            </p>
          </LegalSection>

          <LegalSection title={m.privacy_processing_methods_and_security_measures({}, { locale })}>
            <p>{m.privacy_the_controller_uses_technical_tools_and({}, { locale })} </p>
            <p>
              {m.privacy_communications_use_encrypted_connections_where_supported(
                {},
                { locale },
              )}{" "}
            </p>
            <p>{m.privacy_no_system_can_guarantee_absolute_security({}, { locale })} </p>
          </LegalSection>

          <LegalSection
            title={m.privacy_recipients_and_categories_of_authorized_parties({}, { locale })}
          >
            <p>{m.privacy_the_controller_and_authorized_people_may({}, { locale })} </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>{m.privacy_hosting_runtime_and_edge_services_needed({}, { locale })}</li>
              <li>{m.privacy_database_and_storage_services_used_for({}, { locale })}</li>
              <li>{m.privacy_posthog_in_technical_mode_without_browser({}, { locale })} </li>
              <li>{m.privacy_the_headless_cms_and_article_publishing({}, { locale })} </li>
              <li>{m.privacy_posthog_analytics_and_session_replay_only({}, { locale })} </li>
            </ul>
            <p>{m.privacy_data_is_not_publicly_disclosed_sold({}, { locale })} </p>
          </LegalSection>

          <LegalSection title={m.privacy_transfers_to_third_countries({}, { locale })}>
            <p>{m.privacy_some_providers_may_use_infrastructure_or({}, { locale })} </p>
            <p>{m.privacy_the_controller_reviews_providers_and_service({}, { locale })} </p>
          </LegalSection>

          <LegalSection title={m.privacy_retention_periods_and_criteria({}, { locale })}>
            <p>{m.privacy_data_is_kept_only_as_long({}, { locale })} </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-white">{m.privacy_contact_requests({}, { locale })}</strong>{" "}
                {m.privacy_until_the_request_and_related_conversation({}, { locale })}{" "}
              </li>
              <li>
                <strong className="text-white">
                  {m.privacy_technical_data_and_logs({}, { locale })}
                </strong>{" "}
                {m.privacy_for_as_long_as_needed_for({}, { locale })}{" "}
              </li>
              <li>
                <strong className="text-white">
                  {m.privacy_cookie_preferences({}, { locale })}
                </strong>{" "}
                {m.privacy_until_you_change_or_delete_your({}, { locale })}{" "}
              </li>
              <li>
                <strong className="text-white">{m.privacy_analytics({}, { locale })}</strong>{" "}
                {m.privacy_according_to_posthog_s_configuration_the({}, { locale })}{" "}
              </li>
            </ul>
            <p>{m.privacy_after_the_applicable_period_data_is({}, { locale })} </p>
          </LegalSection>

          <LegalSection title={m.privacy_automated_decision_making_and_profiling({}, { locale })}>
            <p>{m.privacy_the_site_does_not_make_decisions({}, { locale })} </p>
          </LegalSection>

          <LegalSection title={m.privacy_your_rights({}, { locale })}>
            <p>{m.privacy_where_articles_gdpr_apply_you_may({}, { locale })}</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>{m.privacy_access_to_personal_data_and_information({}, { locale })}</li>
              <li>{m.privacy_correction_of_inaccurate_data_or_completion({}, { locale })}</li>
              <li>{m.privacy_deletion_where_the_legal_conditions_are({}, { locale })}</li>
              <li>{m.privacy_restriction_of_processing_as_provided_in({}, { locale })}</li>
              <li>{m.privacy_portability_of_data_you_provided_subject({}, { locale })} </li>
              <li>{m.privacy_objection_to_processing_based_on_legitimate({}, { locale })}</li>
              <li>{m.privacy_withdrawal_of_consent_without_affecting_the({}, { locale })} </li>
            </ul>
            <p>
              {m.privacy_requests_must_be_specific_enough_to({}, { locale })}{" "}
              <Link
                className="text-link underline decoration-link/40 underline-offset-4 hover:text-white"
                to="/contact"
              >
                {m.privacy_contact_page({}, { locale })}{" "}
              </Link>
              {m.privacy_the_controller_will_respond_within_the({}, { locale })}{" "}
            </p>
            <p>
              {m.privacy_you_also_have_the_right_to({}, { locale })}{" "}
              <a
                className="text-link underline decoration-link/40 underline-offset-4 hover:text-white"
                href="https://www.garanteprivacy.it/"
                target="_blank"
                rel="noreferrer"
              >
                {m.privacy_italian_data_protection_authority({}, { locale })}{" "}
              </a>
              .
            </p>
          </LegalSection>

          <LegalSection title={m.privacy_children({}, { locale })}>
            <p>{m.privacy_the_site_is_not_specifically_directed({}, { locale })} </p>
          </LegalSection>

          <LegalSection title={m.privacy_third_party_links({}, { locale })}>
            <p>{m.privacy_pages_may_link_to_linkedin_github({}, { locale })} </p>
          </LegalSection>

          <LegalSection title={m.privacy_changes_to_this_notice({}, { locale })}>
            <p>{m.privacy_the_controller_may_update_this_notice({}, { locale })} </p>
            <p>
              <strong className="text-white">{m.privacy_last_updated({}, { locale })}</strong>{" "}
              {m.privacy_july({}, { locale })}{" "}
            </p>
          </LegalSection>

          <div className="flex flex-wrap gap-3 border-t border-white/10 pt-8">
            <ActionLink href={localizedPath("/cookie", locale)} variant="secondary">
              {m.privacy_read_the_cookie_policy({}, { locale })}{" "}
            </ActionLink>
            <ActionLink href={localizedPath("/contact", locale)}>
              {m.privacy_contact_me({}, { locale })}
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

function PurposeCard({ title, body, basis }: { title: string; body: string; basis: string }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/3.5 p-5">
      <h3 className="display-font text-lg font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-ink-body">{body}</p>
      <p className="mt-4 border-t border-white/10 pt-3 text-xs leading-6 text-link-hover/80">
        {basis}
      </p>
    </article>
  );
}
