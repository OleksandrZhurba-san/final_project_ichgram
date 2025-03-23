import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import {
  Avatar,
  Box,
  Button,
  Typography,
  Link,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { fetchUserById } from "../../store/slices/userSlice";
import {
  getUserFollowers,
  getUserFollowings,
} from "../../store/slices/followSlice";
import {
  getPostsByUser,
  fetchPostById,
  clearSelectedPost,
} from "../../store/slices/postsSlice";
import { getAllCommentsByPost } from "../../store/slices/commentsSlice";
import { logout } from "../../store/slices/authSlice";
import PostModal from "../PostModal/PostModal";
import PostCard from "../PostCard/PostCard";
import UserIcon from "../../assets/icons/user.svg";

const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { currentUser, isLoading } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.posts);
  const { followers, followings } = useSelector((state) => state.follow);

  const isOwnProfile = !userId || userId === user?.id;
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    const targetUserId = userId || user?.id;
    if (targetUserId) {
      dispatch(fetchUserById(targetUserId));
      dispatch(getPostsByUser(targetUserId));
      dispatch(getUserFollowers(targetUserId));
      dispatch(getUserFollowings(targetUserId));
    }
  }, [dispatch, userId, user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleEditProfile = () => {
    navigate("/profile/edit");
  };

  const handleImageClick = async (post) => {
    try {
      setIsOpenModal(true);
      await dispatch(fetchPostById(post._id));
      dispatch(getAllCommentsByPost(post._id));
    } catch (error) {
      console.error("Error fetching post data:", error);
      setIsOpenModal(false);
    }
  };

  const closeModal = () => {
    dispatch(clearSelectedPost());
    setIsOpenModal(false);
  };

  if (isLoading || !currentUser) {
    return <CircularProgress sx={{ mt: 4, mx: "auto" }} />;
  }

  return (
    <Box
      sx={{
        p: { xs: 0, md: 4 },
        width: "100%",
        maxWidth: "100%",
      }}
    >
      {/* Profile Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "center", md: "flex-start" },
          gap: { xs: 2, md: 8 },
          mb: { xs: 2, md: 4 },
          p: { xs: 2, md: 0 },
        }}
      >
        {/* Avatar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: { xs: "100%", md: "auto" },
          }}
        >
          <Avatar
            src={currentUser?.data?.image || UserIcon}
            alt={currentUser?.data?.username}
            sx={{
              width: { xs: 86, md: 150 },
              height: { xs: 86, md: 150 },
            }}
          />
        </Box>

        {/* Profile Info */}
        <Box sx={{ flex: 1, width: { xs: "100%", md: "auto" } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "center", md: "flex-start" },
              gap: 2,
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ textAlign: { xs: "center", md: "left" } }}
            >
              {currentUser?.data?.username}
            </Typography>
            {isOwnProfile && (
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexDirection: { xs: "column", md: "row" },
                  width: { xs: "100%", md: "auto" },
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handleEditProfile}
                  fullWidth={isMobile}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleLogout}
                  fullWidth={isMobile}
                >
                  Logout
                </Button>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: { xs: 3, md: 5 },
              justifyContent: { xs: "center", md: "flex-start" },
              mb: 2,
            }}
          >
            <Typography>{posts?.length || 0} posts</Typography>
            <Typography>{followers?.length || 0} followers</Typography>
            <Typography>{followings?.length || 0} following</Typography>
          </Box>

          {currentUser?.data?.bio && (
            <Typography
              sx={{
                mt: 2,
                textAlign: { xs: "center", md: "left" },
              }}
            >
              {currentUser.data.bio}
            </Typography>
          )}

          {currentUser?.data?.website && (
            <Link
              href={currentUser.data.website}
              target="_blank"
              sx={{
                display: "block",
                textAlign: { xs: "center", md: "left" },
                mt: 1,
              }}
            >
              {currentUser.data.website}
            </Link>
          )}
        </Box>
      </Box>

      {/* Posts Grid */}
      <Grid
        container
        spacing={{ xs: 0.5, md: 2 }}
        sx={{
          mt: { xs: 0, md: 4 },
          mx: { xs: -0.25, md: 0 },
          width: { xs: "calc(100% + 4px)", md: "100%" },
        }}
      >
        {posts?.length > 0 ? (
          posts.map((post) => (
            <Grid
              key={post._id}
              size={{
                xs: 4,
                md: 4,
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  paddingTop: "100%",
                  cursor: "pointer",
                  "&:hover": {
                    opacity: 0.9,
                  },
                  transition: "opacity 0.2s ease",
                }}
              >
                <Box
                  onClick={() => handleImageClick(post)}
                  component="img"
                  src={post.images[0]}
                  alt="Post"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            </Grid>
          ))
        ) : (
          <Grid size={12}>
            <Typography
              sx={{
                textAlign: "center",
                py: { xs: 2, md: 4 },
              }}
            >
              No posts available
            </Typography>
          </Grid>
        )}
      </Grid>

      <PostModal
        isOpenModal={isOpenModal}
        closeModal={closeModal}
        fullScreen={isMobile}
      />
    </Box>
  );
};

export default Profile;
