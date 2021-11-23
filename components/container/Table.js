import { forwardRef, useContext } from "react";
import MaterialTable from "material-table";

import LecketContext from "@/context/LecketContext";
import AddBox from "@mui/icons-material/AddBox";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import Check from "@mui/icons-material/Check";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Clear from "@mui/icons-material/Clear";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import Edit from "@mui/icons-material/Edit";
import FilterList from "@mui/icons-material/FilterList";
import FirstPage from "@mui/icons-material/FirstPage";
import LastPage from "@mui/icons-material/LastPage";
import Remove from "@mui/icons-material/Remove";
import SaveAlt from "@mui/icons-material/SaveAlt";
import Search from "@mui/icons-material/Search";
import ViewColumn from "@mui/icons-material/ViewColumn";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

export default function Table({
  title,
  columnsData,
  dataset,
  search,
  method,
  tableRef,
  rowCount,
}) {
  const { appTheme } = useContext(LecketContext);

  return (
    <div style={{ maxWidth: "100%" }} className={`${appTheme}`}>
      {method ? (
        <MaterialTable
          className={`${appTheme}`}
          tableRef={tableRef}
          icons={tableIcons}
          columns={columnsData}
          data={dataset}
          title={title}
          options={{
            exportButton: true,
            search: search,
            pageSize: rowCount || 5,
            pageSizeOptions: [5, 10, 20, 50, 100],
            headerStyle:
              appTheme && appTheme !== "light"
                ? appTheme === "dark"
                  ? { backgroundColor: "#161616", color: "#fff" }
                  : { backgroundColor: "#000", color: "#fff" }
                : {},
            // selection: true,
          }}
          onRowClick={(event, row) => {
            if (method) {
              method(row);
            }
          }}
          components={{
            Container: (props) => <div className={`${appTheme}`} {...props} />,
          }}
        />
      ) : (
        <MaterialTable
          className={`${appTheme}`}
          tableRef={tableRef}
          icons={tableIcons}
          columns={columnsData}
          data={dataset}
          title={title}
          options={{
            exportButton: true,
            search: search,
            pageSize: rowCount || 5,
            pageSizeOptions: [5, 10, 20, 50, 100],
            headerStyle:
              appTheme && appTheme !== "light"
                ? appTheme === "dark"
                  ? { backgroundColor: "#161616", color: "#fff" }
                  : { backgroundColor: "#000", color: "#fff" }
                : {},
          }}
          components={{
            Container: (props) => <div className={`${appTheme}`} {...props} />,
          }}
        />
      )}
    </div>
  );
}
