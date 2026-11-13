export function publicAuthor(author: { id: string; name: string; username: string | null }) {
  return {
    name: author.name,
    slug:
      author.username ??
      author.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
  };
}
