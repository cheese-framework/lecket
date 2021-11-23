import { useEffect, useState, useContext } from "react";
import Axios from "axios";
import PropTypes from "prop-types";
import { Box, Button, Divider, Drawer, Hidden, ListItem } from "@mui/material";

import AddModeratorIcon from "@mui/icons-material/AddModerator";
import List from "@mui/material/List";
import PaymentIcon from "@mui/icons-material/Payment";
import { BarChart as BarChartIcon } from "react-feather";
import GroupIcon from "@mui/icons-material/Group";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import NotAccessibleIcon from "@mui/icons-material/NotAccessible";
import NavItem from "./NavItem";
import useRouter from "next/router";
import { ADMIN, SUPPORT } from "@/config/index";
import LecketContext from "@/context/LecketContext";

const adminLinks = [
  {
    href: "/",
    icon: BarChartIcon,
    title: "Dashboard",
  },
  {
    href: "/partners",
    icon: GroupIcon,
    title: "Partners",
  },
  {
    href: "/organizations",
    icon: AccountBalanceIcon,
    title: "Subscribers",
  },
  {
    href: "/admin/add",
    icon: AddModeratorIcon,
    title: "Add Admin",
  },
  {
    href: "/admin/vouchers",
    icon: PaymentIcon,
    title: "Vouchers",
  },
];

const supportLinks = [
  {
    href: "/",
    icon: BarChartIcon,
    title: "Dashboard",
  },
  {
    href: "/partners",
    icon: GroupIcon,
    title: "Partners",
  },
  {
    href: "/organizations",
    icon: AccountBalanceIcon,
    title: "Subscribers",
  },
];

const financeLinks = [
  {
    href: "/",
    icon: BarChartIcon,
    title: "Dashboard",
  },
  {
    href: "/finance/cash_delivery",
    icon: DeliveryDiningIcon,
    title: "Cash with Delivery",
  },
  {
    href: "/finance/revenue",
    icon: MonetizationOnIcon,
    title: "Revenue",
  },
  {
    href: "/finance/pending_claims",
    icon: PendingActionsIcon,
    title: "Pending Claims",
  },
  {
    href: "/finance/unclaimed",
    icon: NotAccessibleIcon,
    title: "Unclaimed Settlements",
  },
];

const DashboardSidebar = ({ onMobileClose, openMobile, userData }) => {
  const [items, setItems] = useState([]);
  const { appTheme } = useContext(LecketContext);
  const logout = async () => {
    try {
      const response = await Axios.post("/api/logout");
      response.data ? useRouter.push("/login") : null;
    } catch (e) {}
  };

  useEffect(() => {
    if (userData.user_type === ADMIN) {
      setItems(adminLinks);
    } else if (userData.user_type === SUPPORT) {
      setItems(supportLinks);
    } else {
      setItems(financeLinks);
    }

    // open and close drawer
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [userData]);

  const content = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
      className={appTheme}
    >
      <Divider />
      <Box sx={{ p: 2 }}>
        <List>
          {items.map((item) =>
            item.href === useRouter.asPath ? (
              <NavItem
                href={item.href}
                key={item.title}
                title={item.title}
                icon={item.icon}
                active={true}
              />
            ) : (
              <NavItem
                href={item.href}
                key={item.title}
                title={item.title}
                icon={item.icon}
              />
            )
          )}
          <ListItem
            disableGutters
            style={{
              display: "flex",
            }}
          >
            <Button
              style={{
                color: "black",
                fontWeight: "medium",
                justifyContent: "flex-start",
                letterSpacing: 0,
                padding: "8px",
                textTransform: "none",
                width: "100%",
                "& svg": {
                  mr: 1,
                },
              }}
              onClick={logout}
            >
              <ExitToAppIcon />
              <span style={{ padding: "0 10px" }}>Logout</span>
            </Button>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      <Drawer
        anchor="left"
        onClose={onMobileClose}
        open={openMobile}
        variant="temporary"
        PaperProps={{
          sx: {
            width: 256,
          },
        }}
      >
        {content}
      </Drawer>

      {/* <Hidden xlDown>
        <Drawer
          anchor="left"
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: 256,
              top: 64,
              height: "calc(100% - 64px)",
            },
          }}
        >
          {content}
        </Drawer>
      </Hidden> */}
    </>
  );
};

DashboardSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

DashboardSidebar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false,
};

export default DashboardSidebar;
