import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  searchUsersThunk,
  clearSearchResults,
} from "../../store/slices/searchSlice";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import UserIcon from "../../assets/icons/user.svg";

const SearchBar = ({ closeSearchModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { searchResults, isLoading } = useSelector((state) => state.search);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        dispatch(searchUsersThunk(searchQuery));
      } else {
        dispatch(clearSearchResults());
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, dispatch]);

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
    closeSearchModal();
  };

  return (
    <Box
      sx={{ width: "100%", height: "100%", bgcolor: "background.paper", p: 2 }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Search
      </Typography>

      <TextField
        fullWidth
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            bgcolor: "#efefef",
            "& fieldset": {
              borderColor: "transparent",
            },
            "&:hover fieldset": {
              borderColor: "transparent",
            },
            "&.Mui-focused fieldset": {
              borderColor: "transparent",
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "text.secondary" }} />
            </InputAdornment>
          ),
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                onClick={() => setSearchQuery("")}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : searchResults.length > 0 ? (
        <List>
          {searchResults.map((user) => (
            <ListItem
              key={user._id}
              onClick={() => handleUserClick(user._id)}
              sx={{
                borderRadius: 1,
                mb: 1,
                cursor: "pointer",
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <ListItemAvatar>
                <Avatar src={user.image || UserIcon} alt={user.username} />
              </ListItemAvatar>
              <ListItemText
                primary={user.username}
                secondary={user.bio}
                primaryTypographyProps={{
                  fontWeight: "medium",
                }}
                secondaryTypographyProps={{
                  noWrap: true,
                }}
              />
            </ListItem>
          ))}
        </List>
      ) : searchQuery && !isLoading ? (
        <Box sx={{ textAlign: "center", mt: 4, color: "text.secondary" }}>
          <Typography>No users found</Typography>
        </Box>
      ) : null}
    </Box>
  );
};

export default SearchBar;
