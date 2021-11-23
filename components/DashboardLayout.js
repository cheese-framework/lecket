import { useState, useContext } from "react";
import { styled } from "@mui/material/styles";
import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";
import LecketContext from "@/context/LecketContext";

const DashboardLayoutRoot = styled("div")(({ theme }) => ({
  backgroundColor: "#f2f2f2",
  display: "block",
  width: "100%",
  height: "100vh",
  margin: "10px auto",
}));

const DashboardLayoutWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  overflow: "hidden",
  paddingTop: 64,
  // [theme.breakpoints.down("md")]: {
  //   display: "block",
  // },
}));

const DashboardLayout = ({ children, userData }) => {
  const { appTheme } = useContext(LecketContext);
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  return (
    <DashboardLayoutRoot
      style={
        appTheme
          ? appTheme !== "light"
            ? appTheme === "dark-high"
              ? { backgroundColor: "#070707" }
              : { backgroundColor: "#121212" }
            : { backgroundColor: "#f2f2f2" }
          : { backgroundColor: "#f2f2f2" }
      }
    >
      <DashboardNavbar onMobileNavOpen={() => setMobileNavOpen(true)} />
      <DashboardSidebar
        onMobileClose={() => setMobileNavOpen(false)}
        openMobile={isMobileNavOpen}
        userData={userData}
      />
      <DashboardLayoutWrapper
        style={
          appTheme
            ? appTheme !== "light"
              ? appTheme === "dark-high"
                ? { backgroundColor: "#070707" }
                : { backgroundColor: "#121212" }
              : { backgroundColor: "#f2f2f2" }
            : { backgroundColor: "#f2f2f2" }
        }
      >
        {children}
      </DashboardLayoutWrapper>
    </DashboardLayoutRoot>
  );
};

export default DashboardLayout;
