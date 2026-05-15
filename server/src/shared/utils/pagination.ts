// Pagination helper — extracts page/limit from query params
export function parsePagination(query: any): { page: number; limit: number } {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  return { page, limit };
}
