import classes from "./Posts.module.css";

export default function Posts({ data }) {
  return (
    <>
      <ul className={classes.ul}>
        {data.reverse().map((post) => (
          <li className={classes.li} key={post.id + Math.random()}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
