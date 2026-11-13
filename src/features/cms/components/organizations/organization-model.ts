/* oxlint-disable react/no-unstable-nested-components -- TanStack Table usa callback di rendering nelle definizioni di colonna. */

export type Organization = {
  id: string;
  name: string;
  slug: string;
  type: string;
  description: string | null;
  websiteUrl: string | null;
};

export const organizationTypeOptions = [
  { value: "company", label: "Azienda" },
  { value: "education", label: "Istruzione" },
];
