import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Container,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllPosts,
  fetchPostById,
  clearSelectedPost,
} from "../../store/slices/postsSlice";
import {
  getUserFollowings,
  getUserFollowers,
  addFollowing,
  deleteFollowing,
} from "../../store/slices/followSlice";
import { PostCard, PostModal, SkeletonPostCard } from "../../components";
import { useNavigate } from "react-router-dom";
import { getAllCommentsByPost } from "../../store/slices/commentsSlice";
import { fetchPostLikeStatus } from "../../store/slices/likeSlice";

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, isLoading: postsLoading } = useSelector(
    (state) => state.posts
  );
  const { user, isAuthLoaded } = useSelector((state) => state.auth);
  const { followings } = useSelector((state) => state.follow);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isLikesLoading, setIsLikesLoading] = useState(true);

  const followedIds = followings?.map((f) => f._id) || [];

  useEffect(() => {
    if (!isAuthLoaded) return;
    if (!user) {
      navigate("/login");
    } else {
      dispatch(fetchAllPosts());
      dispatch(getUserFollowings(user.id));
      dispatch(getUserFollowers(user.id));
    }
  }, [isAuthLoaded, user, dispatch, navigate]);

  useEffect(() => {
    const fetchLikes = async () => {
      if (posts?.length > 0) {
        setIsLikesLoading(true);
        try {
          await Promise.all(
            posts.map((post) => dispatch(fetchPostLikeStatus(post._id)))
          );
        } catch (error) {
          console.error("Error fetching likes:", error);
        } finally {
          setIsLikesLoading(false);
        }
      }
    };

    fetchLikes();
  }, [posts, dispatch]);

  const handleModalOpen = async (post) => {
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

  const handleFollowToggle = async (postUserId) => {
    const isFollowing = followedIds.includes(postUserId);
    try {
      if (isFollowing) {
        await dispatch(deleteFollowing(postUserId));
      } else {
        await dispatch(addFollowing(postUserId));
      }
      dispatch(getUserFollowings(user.id));
    } catch (error) {
      console.error("Error updating follow status:", error);
    }
  };

  const filteredPosts = useMemo(
    () => posts.filter((post) => post.user_id._id !== user.id),
    [posts, user.id]
  );

  if (!isAuthLoaded) {
    return <Typography>Loading authentication...</Typography>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        p: { xs: 1, md: 4 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: { xs: 2, md: 3 },
          justifyContent: "center",
          maxWidth: "1800px",
          width: "100%",
        }}
      >
        {postsLoading || isLikesLoading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <Box
                key={idx}
                sx={{
                  width: {
                    xs: "100%",
                    sm: "450px",
                    md: "500px",
                  },
                  maxWidth: "100%",
                }}
              >
                <SkeletonPostCard />
              </Box>
            ))
          : filteredPosts.map((post) => (
              <Box
                key={post._id}
                sx={{
                  width: {
                    xs: "100%",
                    sm: "450px",
                    md: "500px",
                  },
                  maxWidth: "100%",
                }}
              >
                <PostCard
                  post={post}
                  user={user}
                  isFollowing={followedIds.includes(post.user_id._id)}
                  onFollowToggle={handleFollowToggle}
                  onModalOpen={handleModalOpen}
                />
              </Box>
            ))}
      </Box>

      <PostModal
        isOpenModal={isOpenModal}
        closeModal={closeModal}
        fullScreen={isMobile}
      />
    </Box>
  );
};

export default Home;
