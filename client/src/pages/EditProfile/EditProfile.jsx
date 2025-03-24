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
  const { loggedInUser } = useSelector((state) => state.user);
  // const { user: authUser } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    website: "",
    image: null,
    imagePreview: null,
  });

  useEffect(() => {
    if (loggedInUser?.data) {
      setFormData({
        username: loggedInUser.data.username || "",
        website: loggedInUser.data.website || "",
        bio: loggedInUser.data.bio || "",
        image: null,
        imagePreview: loggedInUser.data.image || User,
      });
    }
  }, [loggedInUser?.data]);

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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        py: 4,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "610px",
        }}
      >
        <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
          Edit profile
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            mb: 4,
            bgcolor: "rgba(115, 115, 115, 0.098)",
            p: 3,
            borderRadius: "20px",
            width: "100%",
          }}
        >
          <Avatar
            src={formData.imagePreview || User}
            alt="Profile"
            sx={{ width: 56, height: 56 }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 0.5,
                color: "#000",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              {formData.username}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#737373",
                fontSize: "14px",
              }}
            >
              {formData.bio || "No bio yet"}
            </Typography>
          </Box>
          <Box>
            <Button
              variant="contained"
              component="label"
              sx={{
                width: "114px",
                height: "32px",
                borderRadius: "8px",
                bgcolor: "#0095F6",
                color: "#fff",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#1877F2",
                },
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

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            width: "100%",
          }}
        >
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ mb: 1, fontWeight: "bold", fontSize: "16px" }}
            >
              Username
            </Typography>
            <TextField
              fullWidth
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
                "& .MuiOutlinedInput-input": {
                  fontSize: "14px",
                },
              }}
            />
          </Box>

          <Box>
            <Typography
              variant="subtitle1"
              sx={{ mb: 1, fontWeight: "bold", fontSize: "16px" }}
            >
              Website
            </Typography>
            <TextField
              fullWidth
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              variant="outlined"
              placeholder="bit.ly/3rpilbh"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
                "& .MuiOutlinedInput-input": {
                  fontSize: "14px",
                },
              }}
            />
          </Box>

          <Box>
            <Typography
              variant="subtitle1"
              sx={{ mb: 1, fontWeight: "bold", fontSize: "16px" }}
            >
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
                "& .MuiOutlinedInput-input": {
                  fontSize: "14px",
                },
              }}
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
              height: "32px",
              borderRadius: "8px",
              bgcolor: "#0095F6",
              color: "#fff",
              textTransform: "none",
              "&:hover": {
                bgcolor: "#1877F2",
              },
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EditProfile;
