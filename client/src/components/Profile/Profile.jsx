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
  addFollowing,
  deleteFollowing,
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
  const { currentUser, loggedInUser, isLoading } = useSelector(
    (state) => state.user
  );
  const { posts } = useSelector((state) => state.posts);
  const { followers, followings } = useSelector((state) => state.follow);

  const isOwnProfile = !userId || userId === user?.id;
  const [isOpenModal, setIsOpenModal] = useState(false);
  const isFollowing = followings?.some(
    (following) => following._id === currentUser?.data?._id
  );

  useEffect(() => {
    const targetUserId = userId || user?.id;
    if (targetUserId) {
      dispatch(getPostsByUser(targetUserId));
      dispatch(getUserFollowers(targetUserId));
      dispatch(getUserFollowings(user.id));

      if (!isOwnProfile) {
        dispatch(fetchUserById(targetUserId));
      }
    }
  }, [dispatch, userId, user?.id, isOwnProfile]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleEditProfile = () => {
    navigate("/profile/edit");
  };

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await dispatch(deleteFollowing(userId));
      } else {
        await dispatch(addFollowing(userId));
      }
      dispatch(getUserFollowings(user.id));
    } catch (error) {
      console.error("Error updating follow status:", error);
    }
  };

  const handleImageClick = async (post) => {
    try {
      await dispatch(fetchPostById(post._id));
      dispatch(getAllCommentsByPost(post._id));
      setIsOpenModal(true);
    } catch (error) {
      console.error("Error fetching post data:", error);
    }
  };

  const closeModal = () => {
    dispatch(clearSelectedPost());
    setIsOpenModal(false);
  };

  if (
    isLoading ||
    (!currentUser && !isOwnProfile) ||
    (!loggedInUser && isOwnProfile)
  ) {
    return <CircularProgress sx={{ mt: 4, mx: "auto" }} />;
  }

  const profileData = isOwnProfile ? loggedInUser : currentUser;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Box
        sx={{
          maxWidth: "1196px",
          width: "100%",
          p: { xs: 0, md: 4 },
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
              src={profileData?.data?.image || UserIcon}
              alt={profileData?.data?.username}
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
                {profileData?.data?.username}
              </Typography>
              {isOwnProfile ? (
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
              ) : (
                <Button
                  variant={isFollowing ? "contained" : "contained"}
                  onClick={handleFollowToggle}
                  fullWidth={isMobile}
                  sx={{
                    textTransform: "none",
                    width: "132px",
                    height: "32px",
                    borderRadius: "8px",
                    backgroundColor: isFollowing ? "#EFEFEF" : "#0095F6",
                    color: isFollowing ? "#000" : "#fff",
                    border: "none",
                    fontSize: "14px",
                    fontWeight: 600,
                    minWidth: "132px",
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: isFollowing ? "#EFEFEF" : "#1877F2",
                      border: "none",
                      boxShadow: "none",
                    },
                  }}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
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

            {profileData?.data?.bio && (
              <Typography
                sx={{
                  mt: 2,
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                {profileData.data.bio}
              </Typography>
            )}

            {profileData?.data?.website && (
              <Link
                href={profileData.data.website}
                target="_blank"
                sx={{
                  display: "block",
                  textAlign: { xs: "center", md: "left" },
                  mt: 1,
                }}
              >
                {profileData.data.website}
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
          open={isOpenModal}
          handleClose={closeModal}
          fullScreen={isMobile}
        />
      </Box>
    </Box>
  );
};

export default Profile;
