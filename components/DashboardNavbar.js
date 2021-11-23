import { useState, useContext } from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import { AppBar, Badge, Box, Hidden, IconButton, Toolbar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Logo from "./Logo";
import LecketContext from "@/context/LecketContext";

const DashboardNavbar = ({ onMobileNavOpen, ...rest }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const { setTheme, appTheme } = useContext(LecketContext);

  return (
    <AppBar
      style={{ backgroundColor: "#fff" }}
      className={`${appTheme}`}
      elevation={appTheme && appTheme === "dark" ? 10 : 0}
      {...rest}
    >
      <Toolbar>
        <IconButton color="inherit" onClick={onMobileNavOpen} size="large">
          <MenuIcon style={{ color: "black" }} />
        </IconButton>
        <Logo />
        <Box sx={{ flexGrow: 1 }} />
        <button
          className="dropdown"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <Brightness4Icon
            style={{
              fill: "#aa8301",
            }}
          />
        </button>
        {showDropdown && (
          <div className="dropdown-list">
            <button
              className="dropdown-list__item"
              onClick={() => {
                setTheme("light");
                setShowDropdown(false);
              }}
            >
              Light Theme
            </button>
            <button
              className="dropdown-list__item dark-preview"
              onClick={() => {
                setTheme("dark");
                setShowDropdown(false);
              }}
            >
              Dark Theme
            </button>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

DashboardNavbar.propTypes = {
  onMobileNavOpen: PropTypes.func,
};

export default DashboardNavbar;
