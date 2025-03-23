import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Dialog,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { CreatePostModal } from "../../components";
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
import { useDispatch } from "react-redux";
import { fetchUserById } from "../../store/slices/userSlice";

const SideNav = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activeLink, setActiveLink] = useState("/home");
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLinkClick = (link) => setActiveLink(link);

  const menuItems = useMemo(
    () => [
      { label: "Home", path: "/home", icon: Home, activeIcon: HomeFilled },
      {
        label: "Search",
        path: "/search",
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
      { label: "Create", path: "/create", icon: Create, isCreate: true },
      {
        label: "Profile",
        path: "/profile",
        icon: currentUser?.data?.image || User,
      },
    ],
    [currentUser?.data?.image]
  );

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserById(user.id));
    }
  }, [dispatch, user?.id]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: isMobile ? "28px 0 0 0" : "28px 0 0 25px",
        maxWidth: isMobile ? "60px" : "244px",
        width: "100%",
        borderRight: "1px solid #dbdbdb",
        gap: "24px",
        transition: "all 0.3s ease",
      }}
    >
      {!isMobile && (
        <Box
          component="img"
          src={Logo}
          alt="logo"
          sx={{
            height: "55px",
            width: "97px",
            mb: 2,
            transition: "all 0.3s ease",
          }}
        />
      )}

      <List>
        {menuItems.map(
          ({ label, path, icon, activeIcon, isSearch, isCreate }) => (
            <ListItemButton
              key={path}
              component={isSearch || isCreate ? "button" : NavLink}
              to={!isSearch && !isCreate ? path : undefined}
              onClick={(e) => {
                if (isSearch) {
                  e.preventDefault();
                  setIsSearchModalOpen(true);
                } else if (isCreate) {
                  e.preventDefault();
                  setIsCreatePostOpen(true);
                } else {
                  handleLinkClick(path);
                }
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: "16px",
                fontWeight: activeLink === path ? 800 : 400,
                color: "#000000",
                mb: 1,
                width: "100%",
                justifyContent: isMobile ? "center" : "flex-start",
                padding: isMobile ? "8px" : "8px 16px",
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
                    src={currentUser?.data?.image || User}
                    alt={currentUser?.data?.username}
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

      {/* Search Modal */}
      <Dialog
        open={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        fullScreen={isMobile}
      >
        {/* <SearchBar closeSearchModal={() => setIsSearchModalOpen(false)} /> */}
      </Dialog>
    </Box>
  );
};

export default SideNav;
