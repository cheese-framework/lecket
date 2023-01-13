import $ from "jquery";
// export const API_URL = "http://0.0.0.0.8080/http://192.168.2.181:3004";
// export const API_URL = "http://192.168.2.118:3004";
export const API_URL = "https://api.lecket.gm";
export const MERCHANT_API_URL = "https://api.afrijula.gm/api";
export const INTERNAL_API_URL = "https://lecket.vercel.app"; //window.location.hostname //"http://localhost:3000";

export const TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo0MjIsInByb2ZpbGUiOnsibmFtZSI6Im11cnNoaWQgIFN5IiwicHJvZmlsZSI6ImRlbGl2ZXJ5X2FkbWluIn0sImV4cCI6MTY5OTU1MTIzMX0._ttCeQdsOGJwu9oEXvIZZcGU3eI-Dmd32ziLqRfT5Qs";

export const ADMIN = "Admin::InsistBase";
export const SUPPORT = "Admin::InsistSupport";
export const FINANCE = "Admin::InSISTFinance";

export function compileQuery(
  query,
  url,
  attrs,
  defaultOrder,
  model,
  defaultData,
  defaultFilter,
  searchModels,
  filterModels,
  grouping
) {
  let data = defaultData || {};

  data.attrs = attrs;
  if (query.page !== undefined && query.page !== null) {
    data.page = query.page + 1;
    data.size = query.pageSize;
  }
  data.new_format = true;
  data.model = model;

  if (query.orderBy) {
    data.order = [{ attr: query.orderBy.field, by: query.orderDirection }];
  } else {
    data.order = defaultOrder;
  }

  if (query.search) {
    data.search = query.search;
  }

  if (grouping) {
    data.group = grouping;
  }

  let f = [];
  if (defaultFilter) {
    f.push(defaultFilter);
  }
  if (searchModels) data.searchModels = searchModels;
  if (query.filters) {
    query.filters.forEach((item) => {
      f.push(
        ":" +
          item.column.field +
          getFilterComparator(item.column.tableData.operator) +
          "'" +
          item.column.tableData.filterValue +
          "*'"
      );
    });
  }
  data.query = "{" + f.join(",") + "}";
  if (filterModels) {
  }
  url += "?" + $.param(data);
  return url;
}
