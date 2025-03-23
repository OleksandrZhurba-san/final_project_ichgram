import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Avatar,
  Typography,
  IconButton,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import UserIcon from "../../assets/icons/user.svg";
import { useSelector, useDispatch } from "react-redux";
import {
  postComment,
  getAllCommentsByPost,
} from "../../store/slices/commentsSlice";
import {
  fetchPostLikeStatus,
  togglePostLike,
} from "../../store/slices/likeSlice";
import { timeAgo } from "../../utils/date";
import { useNavigate } from "react-router-dom";

const PostModal = ({ closeModal, isOpenModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { comments, isLoading: commentsLoading } = useSelector(
    (state) => state.comments
  );
  const { selectedPost, isLoading: postLoading } = useSelector(
    (state) => state.posts
  );
  const { likesByPostId } = useSelector((state) => state.likes);

  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (selectedPost?._id) {
      dispatch(fetchPostLikeStatus(selectedPost._id));
    }
  }, [dispatch, selectedPost?._id]);

  useEffect(() => {
    if (selectedPost?._id && isOpenModal) {
      dispatch(getAllCommentsByPost(selectedPost._id));
    }
  }, [dispatch, selectedPost?._id, isOpenModal]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedPost?._id) return;

    const resultAction = await dispatch(
      postComment({ postId: selectedPost._id, text: newComment })
    );

    if (postComment.fulfilled.match(resultAction)) {
      setNewComment("");
      dispatch(getAllCommentsByPost(selectedPost._id));
    }
  };

  const handleTogglePostLike = async () => {
    if (!selectedPost?._id) return;
    await dispatch(togglePostLike(selectedPost._id));
  };

  const handleUserClick = (userId) => {
    if (!userId) return;
    navigate(`/profile/${userId}`);
  };

  if (!isOpenModal) return null;

  const isLiked = selectedPost?._id
    ? likesByPostId[selectedPost._id]?.liked || false
    : false;
  const likeCount = selectedPost?._id
    ? likesByPostId[selectedPost._id]?.count || 0
    : 0;

  return (
    <Dialog
      open={isOpenModal}
      onClose={closeModal}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: "90vh",
          height: "90vh",
        },
      }}
    >
      <DialogContent sx={{ display: "flex", p: 0, height: "100%" }}>
        {postLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : !selectedPost ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography>Post not found</Typography>
          </Box>
        ) : (
          <>
            {/* Left Side - Post Image */}
            <Box
              sx={{
                flex: 1,
                bgcolor: "black",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                overflow: "hidden",
              }}
            >
              <img
                src={selectedPost.images[0]}
                alt="Post"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            </Box>

            {/* Right Side - Post Details */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                p: 2,
                height: "100%",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar
                    src={selectedPost.user_id?.image || UserIcon}
                    alt={selectedPost.user_id?.username}
                    sx={{ width: 40, height: 40, cursor: "pointer" }}
                    onClick={() => handleUserClick(selectedPost.user_id?._id)}
                  />
                  <Typography variant="subtitle1" fontWeight={600}>
                    {selectedPost.user_id?.username}
                  </Typography>
                </Box>
                <IconButton>
                  <MoreHorizIcon />
                </IconButton>
              </Box>

              {/* Comments Section */}
              <Box sx={{ flex: 1, overflowY: "auto", my: 1, pr: 1 }}>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {selectedPost.description}
                </Typography>
                {commentsLoading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : (
                  comments?.map((comment) => (
                    <Box
                      key={comment._id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Avatar
                        src={comment?.user_id?.image || UserIcon}
                        alt={comment?.user_id?.username}
                        sx={{ width: 30, height: 30 }}
                      />
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {comment?.user_id?.username}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "gray" }}>
                          {comment?.text}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                )}
              </Box>

              {/* Like & Comment Actions */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  mt: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton onClick={handleTogglePostLike}>
                    {isLiked ? (
                      <FavoriteIcon color="error" />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </IconButton>
                  <IconButton>
                    <ChatBubbleOutlineIcon />
                  </IconButton>
                </Box>
                <Typography variant="body2" fontWeight={600}>
                  {likeCount} likes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {timeAgo(selectedPost.created_at)}
                </Typography>
              </Box>

              {/* Add Comment Section */}
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <InsertEmoticonIcon sx={{ mr: 1 }} />
                <TextField
                  fullWidth
                  variant="standard"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  sx={{ mr: 1 }}
                />
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  sx={{ textTransform: "none" }}
                >
                  Send
                </Button>
              </Box>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PostModal;
