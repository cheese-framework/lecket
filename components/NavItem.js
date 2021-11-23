import Link from "next/link";
import PropTypes from "prop-types";
import { Button, ListItem, ListItemButton } from "@mui/material";

const NavItem = ({ href, icon: Icon, title, active, ...rest }) => {
  return (
    <ListItem
      disableGutters
      style={{
        display: "flex",
      }}
      {...rest}
      selected={active && true}
    >
      <Link href={href} passHref style={{ color: "black !important" }}>
        <Button
          style={{
            color: "#444",
            justifyContent: "flex-start",
            letterSpacing: 0,
            padding: "8px",
            textTransform: "none",
            width: "100%",

            "& svg": {
              mr: 1,
            },
          }}
        >
          {Icon && <Icon size="20" />}
          <span style={{ padding: "0 10px" }}>{title}</span>
        </Button>
      </Link>
    </ListItem>
  );
};

NavItem.propTypes = {
  href: PropTypes.string,
  icon: PropTypes.elementType,
  title: PropTypes.string,
};

export default NavItem;
