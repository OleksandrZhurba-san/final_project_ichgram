import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAll } from "../../store/slices/postsSlice";

const Home = () => {
  const { posts, isSuccess } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);
  if (isSuccess) {
    return <>{posts && posts.map((e) => <p>{e.description}</p>)}</>;
  }
};

export default Home;
