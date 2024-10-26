import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { menuActions } from "./Store/CustomPost";
import AddPost from "./Posts/AddPost";
import Filter from "./Posts/Filter";
import Posts from "./Posts/Posts";
import classes from "./App.module.css";

export default function App() {
  const [data, setData] = useState();
  const [button, setButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [newData, setNewData] = useState();

  const dispatch = useDispatch();
  const modal = useSelector((state) => state.menu.modal);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        // JSONPlaceholder doesn't let me fetch only 20 posts so I fetched all of them and then filtered them.
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts"
        );
        const data = await response.json();
        setData(data);
      } catch (error) {
        setError(error);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(data));
  }, [data]);

  useEffect(
    function () {
      if (!modal) {
        setButton(false);
      }
    },
    [modal]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const newLocalData = localStorage.getItem("posts");
      if (newLocalData !== newData) {
        setNewData(newLocalData);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [newData]);

  function handleFilterButton() {
    setButton((prevButton) => !prevButton);
  }

  function handleAdding() {
    dispatch(menuActions.showMenu());
  }

  if (loading) {
    return <p>Loading Posts</p>;
  }

  if (error) {
    return <p>Failed to fetch posts</p>;
  }

  if (newData) {
    const array = [];

    for (
      let i = 1;
      i <= JSON.parse(newData)[JSON.parse(newData).length - 1].userId;
      i++
    ) {
      array.push(i);
    }

    return (
      <>
        <AddPost />
        <>
          <button className={classes.addPost} onClick={handleAdding}>
            Add Post
          </button>
          <button className={classes.filter} onClick={handleFilterButton}>
            {button ? "Hide Filter" : "Show Filter"}
          </button>
          {button && <Filter buttons={array} />}
          {!button && (
            <>
              <div className={classes.height}></div>
              <Posts
                data={JSON.parse(newData).filter((post, index) => index < 20)}
              ></Posts>
            </>
          )}
        </>
      </>
    );
  }
}
