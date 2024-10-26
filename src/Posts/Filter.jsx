import { useEffect, useState } from "react";
import Posts from "./Posts";
import classes from "./Filter.module.css";

export default function Filter(buttons) {
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [active, setActive] = useState(1);
  const localData = localStorage.getItem("posts");
  const newId = 11;

  if (
    JSON.parse(localData)[0].userId === newId &&
    buttons.buttons.length < newId
  ) {
    buttons.buttons.push(newId);
  }

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts?userId=1"
        );
        const data = await response.json();
        setFilteredData(data);
      } catch (error) {
        setError(error);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  function handleFilter(id) {
    setActive(id);

    if (id === newId) {
      setFilteredData(
        JSON.parse(localData).filter((data) => data.userId === newId)
      );
    } else {
      const filterPosts = async () => {
        setLoading(true);
        try {
          // I am fetching only the data that I need because it's not practical to always fetch all the data, and that way even if the data is updated I will always get the newest posts.
          //  And by using JSONPlaceholder I can only fetch 10 posts for every Id so I cant fectch the newest 20 while filtering.
          const response = await fetch(
            "https://jsonplaceholder.typicode.com/posts?userId=" + id
          );
          const dataId = await response.json();
          setFilteredData(dataId);
        } catch (error) {
          setError(error);
        }
        setLoading(false);
      };
      filterPosts();
    }
  }

  return (
    <>
      <div>
        <ul className={classes.ul}>
          {buttons.buttons.map(function (post) {
            return (
              <button
                className={active === post ? classes.active : classes.button}
                onClick={() => {
                  handleFilter(post);
                }}
                id={post}
                key={post}
              >
                {post}
              </button>
            );
          })}
        </ul>
        {error && <p>Failed to fetch posts</p>}
        {loading ? <p>Loading Posts</p> : <Posts data={filteredData}></Posts>}
      </div>
    </>
  );
}
