import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements } from "better-auth/plugins/admin/access";

export const cmsStatements = {
  cmsArticle: ["list", "read", "create", "update", "delete", "publish", "restore"],
  cmsService: ["list", "read", "create", "update", "delete", "publish", "restore"],
  cmsCategory: ["list", "read", "create", "update", "delete"],
  cmsMedia: ["list", "read", "upload", "update", "delete"],
} as const;

export const cmsAccessControl = createAccessControl({ ...defaultStatements, ...cmsStatements });
const allCms = Object.fromEntries(
  Object.entries(cmsStatements).map(([key, value]) => [key, [...value]]),
);

export const cmsRoles = {
  admin: cmsAccessControl.newRole({
    user: [
      "create",
      "list",
      "set-role",
      "ban",
      "impersonate",
      "delete",
      "set-password",
      "set-email",
      "get",
      "update",
    ],
    session: ["list", "revoke", "delete"],
    ...allCms,
  }),
  editor: cmsAccessControl.newRole({ user: [], session: [], ...allCms }),
  author: cmsAccessControl.newRole({
    user: [],
    session: [],
    cmsArticle: ["list", "read", "create", "update"],
    cmsService: [],
    cmsCategory: ["list", "read"],
    cmsMedia: ["list", "read", "upload"],
  }),
  user: cmsAccessControl.newRole({
    user: [],
    session: [],
    cmsArticle: [],
    cmsService: [],
    cmsCategory: [],
    cmsMedia: [],
  }),
} as const;

export type CmsRole = keyof typeof cmsRoles;
export type CmsResource = keyof typeof cmsStatements;
export function roleHasPermission(
  role: string | null | undefined,
  resource: CmsResource,
  action: string,
) {
  const configured =
    role === "admin"
      ? cmsRoles.admin
      : role === "editor"
        ? cmsRoles.editor
        : role === "author"
          ? cmsRoles.author
          : role === "user"
            ? cmsRoles.user
            : undefined;
  if (!configured) return false;
  return configured.authorize({ [resource]: [action] }).success;
}
