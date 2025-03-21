import React from "react";
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
  // onImageClick,
}) => {
  const navigate = useNavigate();
  const isUserFollowing = isFollowing[post.user_id._id];
  const isLiked = post.likes.includes(user.id); // likes = array of user IDs

  return (
    <Card sx={styles.postContainer}>
      <CardHeader
        avatar={
          <Avatar
            src={post.user_id.image || UserIcon}
            alt={post.user_id.username}
            sx={{ cursor: "pointer" }}
            onClick={() => navigate(`/profile/${post.user._id}`)}
          />
        }
        title={post.user_id.username}
        subheader={`• ${timeAgo(post.created_at)}`}
        action={
          post.user_id._id !== user?._id && (
            <Button
              variant="outlined"
              size="small"
              sx={styles.followBtn}
              onClick={() => onFollowToggle(post.user._id)}
            >
              {isUserFollowing ? "Unfollow" : "Follow"}
            </Button>
          )
        }
      />

      <CardMedia
        component="img"
        height="400"
        image={post.images[0]} // use first image in array
        alt={post.description}
        sx={{ cursor: "pointer", maxHeight: "505px" }}
        onClick={() => onImageClick(post)}
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
            <IconButton onClick={() => onImageClick(post)}>
              <ChatBubbleOutlineIcon />
            </IconButton>
          </Box>
          <Typography sx={styles.likeCount}>
            {post.likes_count || 0} likes
          </Typography>
        </Box>

        <Box sx={styles.postDescriptionContainer}>
          <Typography sx={styles.fullName}>{post.user_id.full_name}</Typography>
          <Typography sx={styles.description}>
            {post.description.length > 30
              ? `${post.description.slice(0, 30)}...`
              : post.description}
          </Typography>
          {post.description.length > 30 && (
            <Button
              sx={styles.moreBtn}
              size="small"
              onClick={() => onImageClick(post)}
            >
              more
            </Button>
          )}
        </Box>

        <Button
          sx={styles.commentsContainer}
          size="small"
          onClick={() => onImageClick(post)}
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
