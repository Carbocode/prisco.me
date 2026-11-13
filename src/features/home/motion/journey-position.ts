type JourneyGeometry = { start: number; distance: number };

/** Keep the same point in the horizontal story while its viewport changes size. */
export function remapJourneyScroll(
  scrollTop: number,
  previous: JourneyGeometry,
  next: JourneyGeometry,
): number {
  if (
    previous.distance <= 0 ||
    next.distance <= 0 ||
    scrollTop < previous.start ||
    scrollTop > previous.start + previous.distance
  )
    return scrollTop;
  const progress = (scrollTop - previous.start) / previous.distance;
  return next.start + progress * next.distance;
}
