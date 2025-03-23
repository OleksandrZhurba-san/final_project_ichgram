import React, { useState, useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPostLikeStatus,
  togglePostLike,
} from "../../store/slices/likeSlice";

const PostCard = ({
  post,
  user,
  isFollowing,
  onFollowToggle,
  onModalOpen,
  imageOnly = false,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { likesByPostId } = useSelector((state) => state.likes);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        console.log("Fetching like status for post:", post._id);
        await dispatch(fetchPostLikeStatus(post._id)).unwrap();
      } catch (error) {
        console.error("Error fetching like status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikeStatus();
  }, [dispatch, post._id]);

  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription((prev) => !prev);
  };

  const handleLikeToggle = async () => {
    try {
      console.log("Toggling like for post:", post._id);
      await dispatch(togglePostLike(post._id)).unwrap();
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  if (imageOnly) {
    console.log("PostCard imageOnly post:", post);
    console.log("PostCard imageOnly post.images:", post.images);
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

  const isLiked = likesByPostId[post._id]?.liked || false;
  const likeCount = likesByPostId[post._id]?.count || 0;

  console.log("PostCard render - post:", post._id, {
    isLiked,
    likeCount,
    likesByPostId: likesByPostId[post._id],
  });

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
            <Typography
              // variant="outlined"
              // size="small"
              sx={styles.unfollowBtn}
              onClick={() => onFollowToggle(post.user_id._id)}
            >
              Unfollow
            </Typography>
          ) : (
            <Typography
              // variant="contained"
              // size="small"
              sx={styles.followBtn}
              onClick={() => onFollowToggle(post.user_id._id)}
            >
              Follow
            </Typography>
          ))
        }
      />

      <CardMedia
        component="img"
        height="400"
        image={post.images[0]}
        alt={post.description}
        sx={{ cursor: "pointer", maxHeight: "505px" }}
        onDoubleClick={handleLikeToggle}
      />

      <CardContent>
        <Box sx={styles.likeUndCommentContainer}>
          <Box sx={styles.likeUndCommentImgContainer}>
            <IconButton onClick={handleLikeToggle}>
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
            {isLoading ? "Loading..." : `${likeCount} likes`}
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
            ? `View all comments (${post.comments_count})`
            : "No comments"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PostCard;
