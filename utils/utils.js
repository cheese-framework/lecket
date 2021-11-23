import { API_URL } from "@/config/index";
import cookie from "cookie";
import Axios from "axios";

export const isLoggedIn = (req) => {
  const cookies = cookie.parse(req.headers.cookie || "");
  if (cookies && cookies.user) {
    return JSON.parse(cookies.user);
  }
  return false;
};

export const groupArrayOfObjects = (list, key) => {
  return list.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

export const groupByKey = (array, key) => {
  if (array) {
    return array.reduce((hash, obj) => {
      if (obj[key] === undefined) return hash;
      return Object.assign(hash, {
        [obj[key]]: (hash[obj[key]] || []).concat(obj),
      });
    }, {});
  } else {
    return [];
  }
};

export const execPrint = (element) => {
  var mywindow = window.open("", "PRINT", "height=400,width=600");

  mywindow.document.write(element.innerHTML);
  mywindow.document.title = "Print Vouchers";

  mywindow.document.close(); // necessary for IE >= 10
  mywindow.focus(); // necessary for IE >= 10*/

  setTimeout(function () {
    mywindow.print();
    mywindow.close();
  }, 2000);

  return true;
};

export const dateFormat = (n) => {
  //sbensouda: we may have senarios where mongo send us "none" when there is no value. We
  //need to check for this and prevent it from happening.
  if (!n) return "";
  if (n == "none") return n;
  //Used for date display
  let opts = {};
  opts.day = "numeric";
  // opts.weekday = "long";
  opts.year = "numeric";
  opts.month = "numeric";
  let lang = "en-GB";

  n = n.slice(0, 10);
  let _tmp = n.split("-");

  let dd = _tmp[2];
  let mm = _tmp[1] - 1;
  let yyyy = _tmp[0];
  let event = new Date(Date.UTC(yyyy, mm, dd));

  return event.toLocaleDateString(lang, opts);
};

function getDecimal(fig) {
  return fig == 0 || fig == undefined || fig == null ? 0.0 : fig / 100.0;
}

export const currencyFormat = (n, currency) => {
  let lang = "en-GB";
  let opts = {};
  opts.style = "currency";
  if (n && n.currency)
    opts.currency = n.currency ? n.currency.iso_code : n.currency_iso;
  else {
    opts.currency = "GMD";
  }
  if (!n) return 0.0;
  if (!n.currency && !n.currency_iso) {
    if (window.Intl) {
      let formatter = new window.Intl.NumberFormat(lang, opts);
      return formatter.format(n);
    } else {
      return n;
    }
  }
  if (window.Intl) {
    let formatter = new window.Intl.NumberFormat(lang, opts);
    return formatter.format(
      n.cents ? getDecimal(n.cents) : getDecimal(n.fractional)
    );
  } else {
    return n / 100;
  }
};

export const loadBilling = async (userData, id) => {
  try {
    const response = await Axios.get(
      `${API_URL}/organizations_v2/${id}`,
      { billing: true },
      {
        headers: {
          Accept: "application/json",
          Authorization: `token ${userData.auth_token}`,
          UserProfile: userData.profile,
          UserKey: userData.UserKey,
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );
    if (response.data) {
      return response.data;
    }
    return [];
  } catch (err) {
    return [];
  }
};
