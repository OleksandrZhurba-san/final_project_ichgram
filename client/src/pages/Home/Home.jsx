import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts, togglePostLike } from "../../store/slices/postsSlice";
import { useNavigate } from "react-router-dom";
import {
  getUserFollowings,
  getUserFollowers,
  addFollowing,
  deleteFollowing,
} from "../../store/slices/followSlice";
import { PostCard } from "../../components";
// import PostModal from "../../components/postModal";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, isLoading } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);
  const { followings } = useSelector((state) => state.follow);

  const [isFollowing, setIsFollowing] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Fetching posts");
    dispatch(fetchAllPosts());
    dispatch(getUserFollowings(user.id));
    dispatch(getUserFollowers(user.id));
  }, []);

  useEffect(() => {
    if (followings?.length) {
      const followingStatus = {};
      followings.forEach((follow) => {
        followingStatus[follow.following] = true;
      });
      setIsFollowing(followingStatus);
    }
  }, [followings]);

  const handleImageClick = (post) => {
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
    const isUserFollowing = isFollowing[postUserId];

    try {
      if (isUserFollowing) {
        await dispatch(deleteFollowing(postUserId));
      } else {
        await dispatch(addFollowing(postUserId));
      }

      await dispatch(getUserFollowings());
      await dispatch(getUserFollowers());

      setIsFollowing((prev) => ({
        ...prev,
        [postUserId]: !isUserFollowing,
      }));
    } catch (error) {
      setError("Error updating follow status.", error);
    }
  };
  const filteredPosts = posts.filter((post) => post.user_id._id !== user.id);

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 3,
        padding: "58px 0 38px 78px",
      }}
    >
      {isLoading ? (
        <Typography variant="h6" align="center">
          Loading posts...
        </Typography>
      ) : (
        filteredPosts?.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            user={user}
            isFollowing={isFollowing}
            onLikeToggle={handleTogglePostLike}
            onFollowToggle={handleFollowToggle}
            onImageClick={handleImageClick}
          />
        ))
      )}

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
