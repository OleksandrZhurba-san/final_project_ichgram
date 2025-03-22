import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts, togglePostLike } from "../../store/slices/postsSlice";
import {
  getUserFollowings,
  getUserFollowers,
  addFollowing,
  deleteFollowing,
} from "../../store/slices/followSlice";
import { PostCard, PostModal, SkeletonPostCard } from "../../components";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, isLoading } = useSelector((state) => state.posts);
  const { user, isAuthLoaded } = useSelector((state) => state.auth);
  const { followings } = useSelector((state) => state.follow);

  const [selectedPost, setSelectedPost] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [error, setError] = useState(null);

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

  const handleModalOpen = (post) => {
    setSelectedPost(post);
    setIsOpenModal(true);
    navigate(`post/${post._id}`);
  };

  const closeModal = async () => {
    setSelectedPost(null);
    setIsOpenModal(false);
    await dispatch(fetchAllPosts());
    navigate(-1);
  };

  const handleTogglePostLike = async (postId) => {
    try {
      await dispatch(togglePostLike({ postId }));
      dispatch(fetchAllPosts());
    } catch (error) {
      setError("Error toggling like:", error);
    }
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
      setError("Error updating follow status.", error);
    }
  };

  const filteredPosts = posts.filter((post) => post.user_id._id !== user.id);

  if (!isAuthLoaded) {
    return <Typography>Loading authentication...</Typography>;
  }

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, p: 4 }}>
      {isLoading
        ? Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonPostCard key={idx} />
          ))
        : filteredPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              user={user}
              isFollowing={followedIds.includes(post.user_id._id)}
              onLikeToggle={handleTogglePostLike}
              onFollowToggle={handleFollowToggle}
              onModalOpen={handleModalOpen}
            />
          ))}

      {selectedPost && (
        <PostModal
          post={selectedPost}
          isOpenModal={isOpenModal}
          closeModal={closeModal}
        />
      )}
    </Box>
  );
};

export default Home;
