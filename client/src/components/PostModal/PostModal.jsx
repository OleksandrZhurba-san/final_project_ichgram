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
  setCommentsFromPost,
} from "../../store/slices/commentsSlice";
import { togglePostLike } from "../../store/slices/postsSlice";
import { timeAgo } from "../../utils/date";
import { useNavigate } from "react-router-dom";

const PostModal = ({ post, closeModal, isOpenModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { comments, isLoading } = useSelector((state) => state.comments);
  const { user } = useSelector((state) => state.auth);

  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(post?.likes.includes(user?._id));

  useEffect(() => {
    if (post && isOpenModal) {
      dispatch(setCommentsFromPost(post?._id));
    }
  }, [dispatch, post, isOpenModal]);

  const handleAddComment = async () => {
    console.log(comments);
    if (!newComment.trim()) return;
    dispatch(postComment({ postId: post?._id, commentText: newComment }));
    setNewComment("");
    dispatch(setCommentsFromPost(post?.comments));
  };

  const handleTogglePostLike = async () => {
    dispatch(togglePostLike(post?._id));
    setIsLiked(!isLiked);
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <Dialog open={isOpenModal} onClose={closeModal} maxWidth="md" fullWidth>
      <DialogContent sx={{ display: "flex", p: 0 }}>
        {/* Left Side - Post Image */}
        <Box
          sx={{
            flex: 1,
            bgcolor: "black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={post.images[0]}
            alt="Post"
            style={{
              maxWidth: "100%",
              maxHeight: "80vh",
              objectFit: "contain",
            }}
          />
        </Box>

        {/* Right Side - Post Details */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", p: 2 }}>
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
                src={post?.user_id?.image || UserIcon}
                alt={post?.user_id?.username}
                sx={{ width: 40, height: 40, cursor: "pointer" }}
                onClick={() => handleUserClick(post?.user?._id)}
              />
              <Typography variant="subtitle1" fontWeight={600}>
                {post?.user_id?.username}
              </Typography>
            </Box>
            <IconButton>
              <MoreHorizIcon />
            </IconButton>
          </Box>

          {/* Comments Section */}
          <Box sx={{ flex: 1, overflowY: "auto", my: 1, pr: 1 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {post?.description}
            </Typography>
            {isLoading ? (
              <Typography>Loading comments...</Typography>
            ) : (
              comments?.map((comment) => (
                <Box
                  key={comment._id}
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Avatar
                    src={comment?.user?.avatar}
                    alt={comment?.user?.username}
                    sx={{ width: 30, height: 30 }}
                  />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {comment?.user?.username}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "gray" }}>
                      {comment?.commentText}
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
              alignItems: "center",
              justifyContent: "space-between",
              mt: 2,
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
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
            <Typography variant="body2">{timeAgo(post?.created_at)}</Typography>
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
      </DialogContent>
    </Dialog>
  );
};

export default PostModal;
