import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, Avatar } from "@mui/material";
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
import UserIcon from "../../assets/icons/user.svg";

const Home = () => {
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

  // Fetch like status for all posts when they are loaded
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
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, p: 4 }}>
      {postsLoading || isLikesLoading
        ? Array.from({ length: 4 }).map((_, idx) => (
            <SkeletonPostCard key={idx} />
          ))
        : filteredPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              user={user}
              isFollowing={followedIds.includes(post.user_id._id)}
              onFollowToggle={handleFollowToggle}
              onModalOpen={handleModalOpen}
            />
          ))}

      <PostModal isOpenModal={isOpenModal} closeModal={closeModal} />
    </Box>
  );
};

export default Home;
