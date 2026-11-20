export const HOME_FEATURED_CATEGORIES = ["blog", "progetti"] as const;
export type HomeFeaturedCategory = (typeof HOME_FEATURED_CATEGORIES)[number];
