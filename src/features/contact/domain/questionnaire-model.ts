import type { SiteLocale } from "@/config/site";
import {
  createContactRequestSchema,
  type ContactRequestValues,
} from "@/features/contact/domain/contact-request.schema";
import * as m from "@/paraglide/messages.js";

type Interest = ContactRequestValues["interest"];

function makeInterestChoices(locale: SiteLocale) {
  return [
    {
      value: "product",
      label: m.flow_a_product_to_build({}, { locale }),
      description: m.flow_from_i_think_this_could_work({}, { locale }),
    },
    {
      value: "technical",
      label: m.flow_technical_help({}, { locale }),
      description: m.flow_a_problem_to_untangle_in_the({}, { locale }),
    },
    {
      value: "consulting",
      label: m.flow_a_second_opinion({}, { locale }),
      description: m.flow_if_you_have_several_paths_ahead({}, { locale }),
    },
    {
      value: "opportunity",
      label: m.flow_a_career_opportunity({}, { locale }),
      description: m.flow_a_team_a_role_or_a({}, { locale }),
    },
    {
      value: "other",
      label: m.flow_something_else({}, { locale }),
      description: m.flow_if_none_of_the_other_options({}, { locale }),
    },
  ] as const satisfies ReadonlyArray<{ value: Interest; label: string; description: string }>;
}

type Choice = { value: string; label: string };

type Flow = {
  stepLabel: string;
  title: string;
  focus?: { legend: string; summary: string; choices: readonly Choice[] };
  message: { placeholder: string; hint: string };
  company?: { label: string; placeholder: string };
  contactTitle: string;
  phoneHint: string;
  reply: string;
};

function makeFlows(locale: SiteLocale): Record<Interest, Flow> {
  return {
    product: {
      stepLabel: m.flow_the_idea({}, { locale }),
      title: m.flow_what_product_do_you_have_in({}, { locale }),
      focus: {
        legend: m.flow_what_stage_are_you_at({}, { locale }),
        summary: m.flow_stage({}, { locale }),
        choices: [
          { value: "idea", label: m.flow_it_s_still_an_idea({}, { locale }) },
          { value: "prototype", label: m.flow_there_s_already_a_prototype({}, { locale }) },
          { value: "live", label: m.flow_it_s_live_and_needs_improvements({}, { locale }) },
          { value: "unsure", label: m.flow_let_s_figure_it_out_together({}, { locale }) },
        ],
      },
      message: {
        placeholder: m.flow_e_g_an_app_to_book({}, { locale }),
        hint: m.flow_who_needs_it_and_what_problem({}, { locale }),
      },
      company: {
        label: m.flow_project_or_company_name({}, { locale }),
        placeholder: m.flow_e_g_surfbook({}, { locale }),
      },
      contactTitle: m.flow_sounds_good_where_should_i_reply({}, { locale }),
      phoneHint: m.flow_if_you_d_rather_talk_it({}, { locale }),
      reply: m.flow_with_a_few_questions_about_the({}, { locale }),
    },
    technical: {
      stepLabel: m.flow_the_problem({}, { locale }),
      title: m.flow_what_do_you_need_help_with({}, { locale }),
      focus: {
        legend: m.flow_what_kind_of_help_do_you({}, { locale }),
        summary: m.flow_type_of_help({}, { locale }),
        choices: [
          { value: "fix", label: m.flow_fix_existing_code({}, { locale }) },
          { value: "build", label: m.flow_design_something_new({}, { locale }) },
          { value: "team", label: m.flow_support_the_team_for_a_while({}, { locale }) },
          { value: "review", label: m.flow_get_a_review_or_an_outside({}, { locale }) },
        ],
      },
      message: {
        placeholder: m.flow_e_g_move_the_backend_to({}, { locale }),
        hint: m.flow_share_your_stack_and_what_isn({}, { locale }),
      },
      company: {
        label: m.flow_company_or_team({}, { locale }),
        placeholder: m.flow_e_g_acme_ltd({}, { locale }),
      },
      contactTitle: m.flow_let_s_take_a_look_together({}, { locale }),
      phoneHint: m.flow_helpful_if_it_s_urgent({}, { locale }),
      reply: m.flow_with_a_few_technical_questions_to({}, { locale }),
    },
    consulting: {
      stepLabel: m.flow_the_decision({}, { locale }),
      title: m.flow_what_decision_are_you_trying_to({}, { locale }),
      focus: {
        legend: m.flow_what_would_you_like_to_talk({}, { locale }),
        summary: m.flow_topic({}, { locale }),
        choices: [
          { value: "stack", label: m.flow_technologies_and_architecture({}, { locale }) },
          { value: "product", label: m.flow_product_and_priorities({}, { locale }) },
          { value: "process", label: m.flow_processes_and_ways_of_working({}, { locale }) },
          { value: "unsure", label: m.flow_a_bit_of_everything({}, { locale }) },
        ],
      },
      message: {
        placeholder: m.flow_e_g_react_native_or_a({}, { locale }),
        hint: m.flow_what_are_your_options_and_what({}, { locale }),
      },
      company: {
        label: m.flow_company_or_team({}, { locale }),
        placeholder: m.flow_e_g_acme_ltd({}, { locale }),
      },
      contactTitle: m.flow_let_s_think_it_through_where({}, { locale }),
      phoneHint: m.flow_if_you_d_rather_have_a({}, { locale }),
      reply: m.flow_with_a_few_questions_to_prepare({}, { locale }),
    },
    opportunity: {
      stepLabel: m.flow_the_opportunity({}, { locale }),
      title: m.flow_what_kind_of_opportunity_is_it({}, { locale }),
      focus: {
        legend: m.flow_how_would_we_work_together({}, { locale }),
        summary: m.flow_type_of_collaboration({}, { locale }),
        choices: [
          { value: "hire", label: m.flow_a_permanent_role({}, { locale }) },
          { value: "freelance", label: m.flow_a_freelance_project({}, { locale }) },
          { value: "partner", label: m.flow_a_partnership_or_side_project({}, { locale }) },
          { value: "talk", label: m.flow_let_s_talk_first({}, { locale }) },
        ],
      },
      message: {
        placeholder: m.flow_e_g_senior_engineer_on_a({}, { locale }),
        hint: m.flow_share_the_role_team_and_timeline({}, { locale }),
      },
      company: {
        label: m.flow_company({}, { locale }),
        placeholder: m.flow_e_g_acme_ltd({}, { locale }),
      },
      contactTitle: m.flow_i_m_interested_where_should_i({}, { locale }),
      phoneHint: m.flow_if_you_d_prefer_a_quick({}, { locale }),
      reply: m.flow_to_learn_more_about_the_role({}, { locale }),
    },
    other: {
      stepLabel: m.flow_the_context({}, { locale }),
      title: m.flow_tell_me_a_bit_more_what({}, { locale }),
      message: {
        placeholder: m.flow_write_whatever_comes_to_mind({}, { locale }),
        hint: m.flow_explain_it_the_way_you_would({}, { locale }),
      },
      contactTitle: m.flow_i_m_curious_where_should_i({}, { locale }),
      phoneHint: m.flow_if_you_d_rather_have_a({}, { locale }),
      reply: m.flow_after_i_ve_read_it({}, { locale }),
    },
  };
}

const questionnaireCopy = {
  it: { interestChoices: makeInterestChoices("it"), flows: makeFlows("it") },
  en: { interestChoices: makeInterestChoices("en"), flows: makeFlows("en") },
};

export function getQuestionnaireCopy(locale: SiteLocale) {
  return questionnaireCopy[locale];
}

export type Answers = {
  interest?: Interest;
  focus?: string;
  message: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  consentToContact: boolean;
};

export const emptyAnswers: Answers = {
  message: "",
  name: "",
  email: "",
  company: "",
  phone: "",
  consentToContact: false,
};

export type FieldName = Exclude<keyof Answers, "focus">;

export type ItemName = "interest" | "details" | "contact";

export const itemByField: Record<FieldName, ItemName> = {
  interest: "interest",
  message: "details",
  company: "details",
  name: "contact",
  email: "contact",
  phone: "contact",
  consentToContact: "contact",
};

export type Errors = Partial<Record<FieldName, string>>;

export const isFieldName = (value: string): value is FieldName => value in itemByField;

export const isItemName = (value: string): value is ItemName =>
  value === "interest" || value === "details" || value === "contact";

export type Sent = { name: string; email: string; interest: Interest };

export const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? "";

export function collectErrors(
  answers: Answers,
  item?: ItemName,
  locale: SiteLocale = "it",
): Errors {
  const parsed = createContactRequestSchema(locale).safeParse(answers);
  if (parsed.success) return {};
  const errors: Errors = {};
  for (const issue of parsed.error.issues) {
    const field = String(issue.path[0]);
    if (!isFieldName(field) || (item && itemByField[field] !== item)) continue;
    errors[field] ??= issue.message;
  }
  return errors;
}

export type StepListener = (step: number) => void;
