import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Container,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUserProfile } from "../../store/slices/userSlice";
import User from "../../assets/icons/user.svg";

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  // const { user: authUser } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    website: "",
    image: null,
    imagePreview: null,
  });

  useEffect(() => {
    if (currentUser?.data) {
      setFormData({
        username: currentUser.data.username || "",
        website: currentUser.data.website || "",
        bio: currentUser.data.bio || "",
        image: null,
        imagePreview: currentUser.data.image || User,
      });
    }
  }, [currentUser]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file);
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const formDataToSend = new FormData();

    // Add the image first if it exists
    if (formData.image instanceof File) {
      console.log("Appending image file:", formData.image);
      formDataToSend.append("image", formData.image);
    }

    // Add other fields only if they have content
    if (formData.username?.trim()) {
      formDataToSend.append("username", formData.username.trim());
    }

    if (formData.bio?.trim()) {
      formDataToSend.append("bio", formData.bio.trim());
    }

    if (formData.website?.trim()) {
      formDataToSend.append("website", formData.website.trim());
    }

    // Debug: Log what's being sent
    console.log("Form data being sent:");
    for (let [key, value] of formDataToSend.entries()) {
      console.log(key, ":", value instanceof File ? "File" : value);
    }

    try {
      const resultAction = await dispatch(
        updateUserProfile({
          updatedData: formDataToSend,
        })
      ).unwrap();

      if (resultAction) {
        navigate("/profile");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
          Edit profile
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 4,
            bgcolor: "#f8f9fa",
            p: 2,
            borderRadius: 1,
          }}
        >
          <Avatar
            src={formData.imagePreview || User}
            alt="Profile"
            sx={{ width: 56, height: 56 }}
          />
          <Box>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              {formData.username}
            </Typography>
            <Button
              variant="contained"
              component="label"
              sx={{
                bgcolor: "#1da1f2",
                "&:hover": { bgcolor: "#1a91da" },
              }}
            >
              New photo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
              Username
            </Typography>
            <TextField
              fullWidth
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              variant="outlined"
            />
          </Box>

          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
              Website
            </Typography>
            <TextField
              fullWidth
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              variant="outlined"
              placeholder="bit.ly/3rpilbh"
            />
          </Box>

          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
              About
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              variant="outlined"
              placeholder="Write something about yourself..."
              InputProps={{
                sx: { "& .MuiOutlinedInput-input": { resize: "vertical" } },
              }}
              helperText={`${formData.bio.length}/150`}
            />
          </Box>

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            sx={{
              mt: 2,
              bgcolor: "#1da1f2",
              "&:hover": { bgcolor: "#1a91da" },
              py: 1.5,
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default EditProfile;
