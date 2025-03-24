import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { CreatePostModal, SearchBar } from "../../components";
// import SearchBar from "../searchBar";

// Icons
import Create from "../../assets/icons/create_navbar.svg";
import Explore from "../../assets/icons/explore_navbar.svg";
import ExploreFilled from "../../assets/icons/explore_filled_navbar.svg";
import Home from "../../assets/icons/home_navbar.svg";
import HomeFilled from "../../assets/icons/home_filled_navbar.svg";
import Notification from "../../assets/icons/notification_navbar.svg";
import NotificationFilled from "../../assets/icons/notification_filled_navbar.svg";
import Message from "../../assets/icons/msg_navbar.svg";
import MessageFilled from "../../assets/icons/msg_filled_navbar.svg";
import Search from "../../assets/icons/search_navbar.svg";
import SearchFilled from "../../assets/icons/search_filled_navbar.svg";
import User from "../../assets/icons/user.svg";
import Logo from "../../assets/ichgram-logo.png";
import { fetchLoggedInUser } from "../../store/slices/userSlice";

const SideNav = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activeLink, setActiveLink] = useState("/home");
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { loggedInUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLinkClick = (link) => setActiveLink(link);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchLoggedInUser(user.id));
    }
  }, [dispatch, user?.id]);

  const menuItems = useMemo(
    () => [
      { label: "Home", path: "/home", icon: Home, activeIcon: HomeFilled },
      {
        label: "Search",
        icon: Search,
        activeIcon: SearchFilled,
        isSearch: true,
      },
      {
        label: "Explore",
        path: "/explore",
        icon: Explore,
        activeIcon: ExploreFilled,
      },
      {
        label: "Messages",
        path: "/messages",
        icon: Message,
        activeIcon: MessageFilled,
      },
      {
        label: "Notifications",
        path: "/notifications",
        icon: Notification,
        activeIcon: NotificationFilled,
      },
      {
        label: "Create",
        icon: Create,
        isCreate: true,
      },
      {
        label: "Profile",
        path: "/profile",
        icon: loggedInUser?.data?.image || User,
      },
    ],
    [loggedInUser?.data?.image]
  );

  return (
    <Box
      sx={{
        height: "100vh",
        borderRight: "1px solid",
        borderColor: "divider",
        position: "fixed",
        bgcolor: "background.paper",
        width: isMobile ? "auto" : 244,
        display: "flex",
        flexDirection: "column",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Box
        component={NavLink}
        to="/home"
        sx={{
          py: isMobile ? 2 : 4,
          px: isMobile ? 2 : 3,
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        {!isMobile && (
          <Box
            component="img"
            src={Logo}
            alt="Logo"
            sx={{ height: "32px", width: "103px" }}
          />
        )}
        {isMobile && (
          <Box
            component="img"
            src={Logo}
            alt="Logo"
            sx={{ height: "24px", width: "24px" }}
          />
        )}
      </Box>

      <List sx={{ flex: 1, px: isMobile ? 0 : 1 }}>
        {menuItems.map(
          ({ label, path, icon, activeIcon, isSearch, isCreate }) => (
            <ListItemButton
              key={label}
              {...(isSearch || isCreate
                ? { component: "div" }
                : { component: NavLink, to: path })}
              onClick={() => {
                if (isSearch) {
                  setIsSearchModalOpen(true);
                } else if (isCreate) {
                  setIsCreatePostOpen(true);
                } else {
                  handleLinkClick(path);
                }
              }}
              sx={{
                borderRadius: 2,
                mb: 1,
                px: isMobile ? 2 : 2,
                "&.active": {
                  bgcolor: "action.selected",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: "auto",
                  mr: isMobile ? 0 : 2,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {label === "Profile" ? (
                  <Avatar
                    src={loggedInUser?.data?.image || User}
                    alt={loggedInUser?.data?.username}
                    sx={{
                      width: isMobile ? 24 : 32,
                      height: isMobile ? 24 : 32,
                      transition: "all 0.3s ease",
                    }}
                  />
                ) : (
                  <Box
                    component="img"
                    src={activeLink === path ? activeIcon || icon : icon}
                    alt={label}
                    sx={{
                      height: isMobile ? "24px" : "28px",
                      width: isMobile ? "24px" : "28px",
                      transition: "all 0.3s ease",
                    }}
                  />
                )}
              </ListItemIcon>
              {!isMobile && <ListItemText primary={label} />}
            </ListItemButton>
          )
        )}
      </List>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />

      {/* Search Drawer */}
      <Drawer
        anchor="left"
        open={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: isMobile ? "100%" : "400px",
            marginLeft: isMobile ? 0 : "244px",
            height: "100%",
            boxSizing: "border-box",
          },
        }}
        variant="temporary"
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
      >
        <SearchBar closeSearchModal={() => setIsSearchModalOpen(false)} />
      </Drawer>
    </Box>
  );
};

export default SideNav;
