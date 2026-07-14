import { CmsError } from "./cms-errors";
export const publicHeaders = { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" };
export function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: publicHeaders });
}
export function jsonError(error: unknown) {
  if (error instanceof CmsError)
    return Response.json(
      { error: { code: error.code, message: error.message } },
      { status: error.status },
    );
  return Response.json(
    { error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
    { status: 500 },
  );
}
