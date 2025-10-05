export function paginate(list, page = 1, perPage = 10) {
  const total = list.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  const p = Math.min(Math.max(1, page), pageCount);
  const paginated = list.slice((p - 1) * perPage, p * perPage);
  return { page: p, perPage, total, pageCount, paginated };
}

