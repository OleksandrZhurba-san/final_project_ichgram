import { Box, Skeleton, Card, CardHeader, CardContent } from "@mui/material";

const SkeletonPostCard = () => (
  <Card sx={{ width: 404, height: 700 }}>
    <CardHeader
      avatar={<Skeleton variant="circular" width={40} height={40} />}
      title={<Skeleton width="40%" />}
      subheader={<Skeleton width="30%" />}
    />
    <Skeleton variant="rectangular" height={400} width="100%" />
    <CardContent>
      <Skeleton width="60%" />
      <Skeleton width="90%" />
      <Skeleton width="30%" />
    </CardContent>
  </Card>
);

export default SkeletonPostCard;
