/* oxlint-disable react/no-unstable-nested-components -- TanStack Table usa callback di rendering nelle definizioni di colonna. */

export type Tag = {
  marqueeRow: number | null;
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  icon: string | null;
  color: string;
};

export type Category = { id: string; name: string };
