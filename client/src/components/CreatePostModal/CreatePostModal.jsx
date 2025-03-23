import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  IconButton,
} from "@mui/material";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { useDispatch, useSelector } from "react-redux";
import { createNewPost, getPostsByUser } from "../../store/slices/postsSlice";
import { fetchUserById } from "../../store/slices/userSlice";
import Upload from "../../assets/icons/upload.svg";
import User from "../../assets/icons/user.svg";
import EmojiPicker from "emoji-picker-react";
import { useNavigate } from "react-router-dom";

const CreatePostModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const { user: authUser } = useSelector((state) => state.auth);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && authUser?.id) {
      dispatch(fetchUserById(authUser.id));
    }
  }, [isOpen, authUser?.id, dispatch]);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onEmojiClick = (emojiObject) => {
    setDescription((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleSubmit = async () => {
    if (!image) return;
    setIsLoading(true);
    try {
      await dispatch(createNewPost({ description, image })).unwrap();
      // Refetch posts after creating a new one
      await dispatch(getPostsByUser(authUser.id));
      onClose();
      // Reset form
      setDescription("");
      setImage(null);
      setPreview(null);
      navigate("/profile");
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: "90vh",
          height: "90vh",
          maxWidth: "1440px",
          width: "100%",
          borderRadius: "12px",
          overflow: "hidden",
        },
      }}
    >
      <DialogContent sx={{ display: "flex", p: 0, height: "100%" }}>
        <Box sx={{ display: "flex", width: "100%" }}>
          {/* Left side - Image upload */}
          <Box
            sx={{
              flex: 2,
              bgcolor: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              borderRight: "1px solid #dbdbdb",
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              style={{ display: "none" }}
              ref={fileInputRef}
            />
            {preview ? (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    borderRadius: "8px",
                  }}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  cursor: "pointer",
                  color: "#8e8e8e",
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <img
                  src={Upload}
                  alt="Upload"
                  style={{ width: "154px", height: "154px" }}
                />
                <Typography variant="h6" color="inherit">
                  Click to upload image
                </Typography>
                <Typography variant="body2" color="inherit">
                  or drag and drop
                </Typography>
              </Box>
            )}
          </Box>

          {/* Right side - Description */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              p: 2,
              gap: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #dbdbdb",
                pb: 1.5,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Create new post
              </Typography>
              <Button
                onClick={handleSubmit}
                disabled={!image || isLoading}
                sx={{
                  color: "#0095f6",
                  textTransform: "none",
                  fontWeight: 700,
                  "&:hover": {
                    background: "none",
                  },
                  "&.Mui-disabled": {
                    color: "#b2dffc",
                  },
                }}
              >
                {isLoading ? <CircularProgress size={20} /> : "Share"}
              </Button>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                component="img"
                src={currentUser?.data?.image || User}
                alt="User"
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  border: "3px solid #fff",
                  boxShadow:
                    "0 0 0 3px rgba(255, 105, 180, 0.9), 0 0 6px 1.5px rgba(255, 140, 0, 0.7), 0 0 10px -1.5px rgba(255, 105, 180, 0.6)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#f477e4",
                    boxShadow: "0 0 8px #f4b1db",
                  },
                }}
              />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {currentUser?.data?.username}
              </Typography>
            </Box>

            <Box sx={{ position: "relative", width: "100%" }}>
              <TextField
                multiline
                rows={4}
                placeholder="Write a caption..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    border: "1px solid #dbdbdb",
                    "&:hover": {
                      borderColor: "#dbdbdb",
                    },
                    paddingBottom: "40px",
                  },
                }}
              />
              <IconButton
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                sx={{
                  position: "absolute",
                  right: 8,
                  bottom: 8,
                  color: "#8e8e8e",
                  "&:hover": {
                    background: "none",
                  },
                }}
              >
                <EmojiEmotionsIcon />
              </IconButton>
              {showEmojiPicker && (
                <Box
                  sx={{
                    position: "absolute",
                    right: "1",
                    bottom: "1",
                    zIndex: 9999,
                    "& .EmojiPickerReact": {
                      width: "300px !important",
                      height: "350px !important",
                    },
                  }}
                >
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    width={400}
                    height={350}
                    emojiStyle="native"
                    theme="light"
                    searchPlaceholder="Search emoji..."
                    previewConfig={{
                      showPreview: false,
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
