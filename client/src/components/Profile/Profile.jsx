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
    <Box sx={{ p: { xs: 2, md: 6 }, width: "100%" }}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Avatar
            src={currentUser?.data?.image || UserIcon}
            alt={currentUser?.data?.username}
            sx={{ width: 150, height: 150 }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h6">{currentUser?.data?.username}</Typography>
            {isOwnProfile ? (
              <>
                <Button variant="outlined" onClick={handleEditProfile}>
                  Edit Profile
                </Button>
                <Button variant="outlined" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : null}
          </Box>

          <Box display="flex" gap={5} mt={2}>
            <Typography>{posts?.length || 0} posts</Typography>
            <Typography>{followers?.length || 0} followers</Typography>
            <Typography>{followings?.length || 0} following</Typography>
          </Box>

          {currentUser?.data?.bio && (
            <Typography mt={2}>{currentUser.data.bio}</Typography>
          )}

          {currentUser?.data?.website && (
            <Link href={currentUser.data.website} target="_blank">
              {currentUser.data.website}
            </Link>
          )}
        </Grid>
      </Grid>

      <Grid container spacing={2} mt={6}>
        {posts?.length > 0 ? (
          posts.map((post) => (
            <Grid key={post._id} size={{ sx: 12, sm: 6, md: 4, lg: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  p: 0.5,
                }}
              >
                <PostCard
                  post={post}
                  user={currentUser}
                  imageOnly
                  onModalOpen={handleImageClick}
                />
              </Box>
            </Grid>
          ))
        ) : (
          <Typography>No posts available</Typography>
        )}
      </Grid>

      <PostModal isOpenModal={isOpenModal} closeModal={closeModal} />
    </Box>
  );
};

export default Profile;
