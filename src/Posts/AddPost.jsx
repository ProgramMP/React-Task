import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { menuActions } from "../Store/CustomPost";
import classes from "./AddPost.module.css";

export default function AddPost({}) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [allPosts, setAllPosts] = useState();

  const title = useRef();
  const message = useRef();

  const menu = useSelector((state) => state.menu.menu);
  const modal = useSelector((state) => state.menu.modal);

  const dispatch = useDispatch();

  function handleAddPost(event) {
    event.preventDefault();

    const createPost = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts",
          {
            method: "POST",
            body: JSON.stringify({
              userId: 11,
              title: title.current.value,
              body: message.current.value,
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          }
        );
        const data = await response.json();
        setData(data);

        setAllPosts(JSON.parse(localStorage.getItem("posts")));

        title.current.value = "";
        message.current.value = "";
      } catch (error) {
        setError(error);
      }
      setLoading(false);
    };

    createPost();
  }

  function handleCloseMenu() {
    dispatch(menuActions.hideModal());
    dispatch(menuActions.hideMenu());
  }

  if (error) {
    return <p>Failed to add post!</p>;
  }

  useEffect(
    function () {
      if (data) {
        // The Id will always be 101 because JSONPlaceholder only fakes that it's adding new post so I am adding it and storing it in the beggining
        allPosts.unshift(data);
        localStorage.setItem("posts", JSON.stringify(allPosts));

        dispatch(menuActions.showModal());
      }
    },
    [data]
  );

  return (
    <>
      <div
        className={menu ? classes.overlay : ""}
        onClick={handleCloseMenu}
      ></div>
      <dialog open={menu} className={classes.modal} onClose={handleCloseMenu}>
        {!modal && (
          <form onSubmit={handleAddPost}>
            <div className={classes.form}>
              <label>Title</label>
              <input ref={title} required></input>
            </div>
            <div className={classes.form}>
              <label>Message</label>
              <input ref={message} required></input>
            </div>
            <button disabled={loading} className={classes.button}>
              Add Post
            </button>
            <button
              onClick={handleCloseMenu}
              type="button"
              className={classes.cancel}
            >
              Cancel
            </button>
          </form>
        )}
        {modal && (
          <>
            <p className={classes.message}>Your Post Was Added!</p>
            <button className={classes.button} onClick={handleCloseMenu}>
              Okay
            </button>
          </>
        )}
      </dialog>
    </>
  );
}
