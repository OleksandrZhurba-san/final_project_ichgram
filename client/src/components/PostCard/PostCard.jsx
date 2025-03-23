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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { timeAgo } from "../../utils/date.js";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { styles } from "./PostCardStyles.js";
import UserIcon from "../../assets/icons/user.svg";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { likesByPostId } = useSelector((state) => state.likes);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
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
      await dispatch(togglePostLike(post._id)).unwrap();
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const isLiked = likesByPostId[post._id]?.liked || false;
  const likeCount = likesByPostId[post._id]?.count || 0;

  if (imageOnly) {
    return (
      <Box
        component="img"
        src={post.images[0]}
        alt={post.description}
        onClick={() => onModalOpen(post)}
        sx={{
          width: "100%",
          height: "100%",
          maxWidth: "300px",
          maxHeight: "400px",
          objectFit: "cover",
          borderRadius: 2,
          cursor: "pointer",
          display: "block",
        }}
      />
    );
  }

  return (
    <Card
      sx={{
        ...styles.postContainer,
        borderRadius: { xs: 0, md: 2 },
        border: { xs: "none", md: "1px solid #dbdbdb" },
      }}
    >
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
              sx={{
                ...styles.unfollowBtn,
                px: { xs: 1, md: 2 },
                fontSize: { xs: "12px", md: "14px" },
              }}
              onClick={() => onFollowToggle(post.user_id._id)}
            >
              Unfollow
            </Typography>
          ) : (
            <Typography
              sx={{
                ...styles.followBtn,
                px: { xs: 1, md: 2 },
                fontSize: { xs: "12px", md: "14px" },
              }}
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
        sx={{
          cursor: "pointer",
          maxHeight: { xs: "calc(100vh - 200px)", md: "505px" },
          objectFit: "contain",
          bgcolor: "black",
        }}
        onDoubleClick={handleLikeToggle}
      />

      <CardContent>
        <Box sx={styles.likeUndCommentContainer}>
          <Box sx={styles.likeUndCommentImgContainer}>
            <IconButton
              onClick={handleLikeToggle}
              size={isMobile ? "small" : "medium"}
            >
              {isLiked ? (
                <FavoriteIcon sx={{ color: "red" }} />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
            <IconButton
              onClick={() => onModalOpen(post)}
              size={isMobile ? "small" : "medium"}
            >
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
