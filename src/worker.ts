// oxlint-disable-next-line import/no-unassigned-import -- Better Auth decorators require metadata initialization before loading the server.
import "reflect-metadata";

const { default: server } = await import("./server");

export default server;
