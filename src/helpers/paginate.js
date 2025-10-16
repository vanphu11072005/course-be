// helpers/paginate.js
export async function paginate(model, options = {}) {
  const {
    page = 1,
    pageSize = 10,
    filters = {}, // object { field: value, ... }
    sort = [["createdAt", "DESC"]], // mặc định sort theo createdAt giảm dần
    attributes, // nếu muốn giới hạn field trả về
    include, // nếu muốn join bảng khác
  } = options;

  const limit = Math.max(parseInt(pageSize), 1);
  const offset = (Math.max(parseInt(page), 1) - 1) * limit;

  // build where condition
  const where = {};
  for (const key in filters) {
    if (filters[key] !== undefined && filters[key] !== null) {
      where[key] = filters[key];
    }
  }

  const { count, rows } = await model.findAndCountAll({
    where,
    order: sort,
    limit,
    offset,
    attributes,
    include,
  });

  return {
    data: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      pageSize: limit,
      totalPages: Math.ceil(count / limit),
    },
  };
}
