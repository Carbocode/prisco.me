export class CmsError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}
export const notFound = (entity: string) =>
  new CmsError(404, `${entity.toUpperCase()}_NOT_FOUND`, `${entity} not found`);
