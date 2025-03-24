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
import { togglePostLike } from "../../store/slices/likeSlice";
import { timeAgo } from "../../utils/date";
import { useNavigate } from "react-router-dom";

const PostModal = ({
  handleClose,
  open,
  fullScreen,
  modalId = "default-modal",
  post,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { comments, isLoading: commentsLoading } = useSelector(
    (state) => state.comments
  );
  const { likesByPostId } = useSelector((state) => state.likes);

  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (!open) {
      setNewComment("");
    }
  }, [open]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !post?._id) return;

    try {
      await dispatch(
        postComment({ postId: post._id, text: newComment })
      ).unwrap();
      setNewComment("");
      dispatch(getAllCommentsByPost(post._id));
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleTogglePostLike = async () => {
    if (!post?._id) return;
    try {
      await dispatch(togglePostLike(post._id));
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleUserClick = (userId) => {
    if (!userId) return;
    navigate(`/profile/${userId}`);
  };

  if (!open) return null;

  const isLiked = post?._id ? likesByPostId[post._id]?.liked || false : false;
  const likeCount = post?._id ? likesByPostId[post._id]?.count || 0 : 0;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          maxHeight: "90vh",
          height: "90vh",
          maxWidth: "1000px",
          width: "100%",
        },
      }}
      id={modalId}
    >
      <DialogContent sx={{ display: "flex", p: 0, height: "100%" }}>
        {!post ? (
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
                src={post.images[0]}
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
                    src={post.user_id?.image || UserIcon}
                    alt={post.user_id?.username}
                    sx={{ width: 40, height: 40, cursor: "pointer" }}
                    onClick={() => handleUserClick(post.user_id?._id)}
                  />
                  <Typography variant="subtitle1" fontWeight={600}>
                    {post.user_id?.username}
                  </Typography>
                </Box>
                <IconButton>
                  <MoreHorizIcon />
                </IconButton>
              </Box>

              {/* Comments Section */}
              <Box sx={{ flex: 1, overflowY: "auto", my: 1, pr: 1 }}>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {post.description}
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
                  {timeAgo(post.created_at)}
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
