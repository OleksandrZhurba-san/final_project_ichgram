import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllPosts,
  fetchPostById,
  clearSelectedPost,
} from "../../store/slices/postsSlice";
import { getAllCommentsByPost } from "../../store/slices/commentsSlice";
import PostModal from "../../components/PostModal/PostModal";

const ExplorePage = () => {
  const dispatch = useDispatch();
  const { posts, isLoading } = useSelector((state) => state.posts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [randomPosts, setRandomPosts] = useState([]);

  useEffect(() => {
    dispatch(fetchAllPosts());
  }, [dispatch]);

  useEffect(() => {
    if (posts) {
      const shuffledPosts = [...posts].sort(() => Math.random() - 0.5);
      setRandomPosts(shuffledPosts);
    }
  }, [posts]);

  const handleModalOpen = async (post) => {
    try {
      setIsModalOpen(true);
      await dispatch(fetchPostById(post._id));
      dispatch(getAllCommentsByPost(post._id));
    } catch (error) {
      console.error("Error fetching post data:", error);
      setIsModalOpen(false);
    }
  };

  const closeModal = () => {
    dispatch(clearSelectedPost());
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={1}>
        {randomPosts.map((post) => (
          <Grid size={{ xs: 4 }} key={post._id}>
            <Box
              onClick={() => handleModalOpen(post)}
              sx={{
                position: "relative",
                paddingTop: "100%", // Makes it square
                cursor: "pointer",
                "&:hover": {
                  opacity: 0.9,
                },
              }}
            >
              <Box
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
        ))}
      </Grid>

      <PostModal isOpenModal={isModalOpen} closeModal={closeModal} />
    </Box>
  );
};

export default ExplorePage;
