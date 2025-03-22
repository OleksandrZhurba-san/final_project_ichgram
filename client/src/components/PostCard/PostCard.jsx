import React, { useState } from "react";
import {
  Box,
  Card,
  CardHeader,
  Avatar,
  CardMedia,
  CardContent,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useNavigate } from "react-router-dom";
import { timeAgo } from "../../utils/date.js";
import UserIcon from "../../assets/icons/user.svg";
import { styles } from "./PostCardStyles.js";

const PostCard = ({
  post,
  user,
  isFollowing,
  onLikeToggle,
  onFollowToggle,
  onModalOpen,
  imageOnly = false,
}) => {
  const navigate = useNavigate();
  const isLiked = post.likes.includes(user.id);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription((prev) => !prev);
  };

  if (imageOnly) {
    return (
      <Box
        component="img"
        src={post.images[0]}
        alt={post.description}
        onClick={() => onModalOpen(post)}
        sx={{
          width: 300,
          height: 300,
          objectFit: "cover",
          borderRadius: 2,
          cursor: "pointer",
        }}
      />
    );
  }

  return (
    <Card sx={styles.postContainer}>
      <CardHeader
        avatar={
          <Avatar
            src={post.user_id.image || UserIcon}
            alt={post.user_id.username}
            sx={{ cursor: "pointer" }}
            onClick={() => navigate(`/profile/${post.user_id._id}`)}
          />
        }
        title={post.user_id.username}
        subheader={`• ${timeAgo(post.created_at)}`}
        action={
          post.user_id._id !== user.id &&
          (isFollowing ? (
            <Button
              variant="outlined"
              size="small"
              sx={styles.followBtn}
              onClick={() => onFollowToggle(post.user_id._id)}
            >
              Unfollow
            </Button>
          ) : (
            <Button
              variant="contained"
              size="small"
              sx={{ textTransform: "none" }}
              onClick={() => onFollowToggle(post.user_id._id)}
            >
              Follow
            </Button>
          ))
        }
      />

      <CardMedia
        component="img"
        height="400"
        image={post.images[0]}
        alt={post.description}
        sx={{ cursor: "pointer", maxHeight: "505px" }}
        onClick={() => onModalOpen(post)}
      />

      <CardContent>
        <Box sx={styles.likeUndCommentContainer}>
          <Box sx={styles.likeUndCommentImgContainer}>
            <IconButton onClick={() => onLikeToggle(post._id)}>
              {isLiked ? (
                <FavoriteIcon sx={{ color: "red" }} />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
            <IconButton onClick={() => onModalOpen(post)}>
              <ChatBubbleOutlineIcon />
            </IconButton>
          </Box>
          <Typography sx={styles.likeCount}>
            {post.likes_count || 0} likes
          </Typography>
        </Box>

        <Box sx={styles.postDescriptionContainer}>
          <Typography sx={styles.fullName}>{post.user_id.username}</Typography>
          <Typography sx={styles.description}>
            {showFullDescription
              ? post.description
              : post.description.length > 30
              ? `${post.description.slice(0, 30)}...`
              : post.description}
          </Typography>
          {post.description.length > 30 && (
            <Button
              sx={styles.moreBtn}
              size="small"
              onClick={toggleDescription}
            >
              {showFullDescription ? "less" : "more"}
            </Button>
          )}
        </Box>

        <Button
          sx={styles.commentsContainer}
          size="small"
          onClick={() => onModalOpen(post)}
        >
          {post.comments?.length > 0
            ? `View all comments (${post.comments.length})`
            : "No comments"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PostCard;
