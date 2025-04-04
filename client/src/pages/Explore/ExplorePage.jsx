import React, { useEffect, useState } from "react";
import { Box, CircularProgress, useTheme, useMediaQuery } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts } from "../../store/slices/postsSlice";
import { getAllCommentsByPost } from "../../store/slices/commentsSlice";
import { PostModal } from "../../components";

const ExplorePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const { posts, isLoading } = useSelector((state) => state.posts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
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
      setSelectedPost(post);
      setIsModalOpen(true);
      // Only fetch comments
      await dispatch(getAllCommentsByPost(post._id));
    } catch (error) {
      console.error("Error fetching post data:", error);
      setIsModalOpen(false);
      setSelectedPost(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
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
    <Box
      sx={{
        p: { xs: 0, sm: 1, md: 2 },
        width: "100%",
        maxWidth: "1440px",
        margin: "0 auto",
        overflow: "hidden",
        ml: { xs: 0, sm: 1 },
      }}
    >
      <Grid container spacing={{ xs: 0, sm: 1, md: 1 }}>
        {randomPosts.map((post) => (
          <Grid
            size={{
              xs: 4, // 3 columns on mobile
              sm: 3, // 4 columns on tablet
              md: 3, // 4 columns on desktop
            }}
            key={post._id}
          >
            <Box
              onClick={() => handleModalOpen(post)}
              sx={{
                position: "relative",
                paddingTop: "100%", // Makes it square
                cursor: "pointer",
                "&:hover": {
                  opacity: 0.9,
                },
                transition: "opacity 0.2s ease",
                border: "1px solid #dbdbdb",
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

      <PostModal
        open={isModalOpen}
        handleClose={closeModal}
        fullScreen={isMobile}
        modalId="explore-post-modal"
        post={selectedPost}
      />
    </Box>
  );
};

export default ExplorePage;
