import client from "../lib/mongodbconn";
import Post from "../components/Post";
import { useState } from "react";
import { Alert } from "react-bootstrap";

export default function Home({ posts, rmassage }) {
  const [massage, setmassage] = useState(rmassage);
  return (
    <div>
      <div>
        {massage && (
          <Alert
            variant={
              massage == "Approved" ||
              massage == "Done" ||
              massage == "ApprovedPost"
                ? "success"
                : "danger"
            }
            className="mx-2 w-md-1 ms-md-5"
            onClose={() => {
              setmassage("");
            }}
            dismissible
          >
            {massage == "Approved"
              ? "You have approved a user"
              : massage == "ApprovedPost"
              ? "You have approved a post"
              : massage == "Denied"
              ? "You have denied a user"
              : massage == "DeniedPost"
              ? "You have denied a post"
              : massage == "nouser"
              ? "You can't review that user"
              : massage == "nopost"
              ? "You can't review that artical"
              : massage == "postdeleted"
              ? "You Have deleted a post"
              : massage == "coursedeleted"
              ? "You have deleted a course"
              : massage == "Done"
              ? "You have updated a post"
              : "Error"}
          </Alert>
        )}
      </div>
      <div>
        {posts.length ? (
          posts.map((post) => (
            <>
              <Post key={post._id} post={post} sector="posts" />
            </>
          ))
        ) : (
          <div className="mx-auto" style={{ width: "max-content" }}>
            no articals is here yet
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const cl = await client;
  const db = await cl.db();
  const col = await db.collection("posts");
  const rposts = await col.find({
    status: "Approved",
  });
  const posts = await rposts.toArray();
  for (let i = 0; i < posts.length; i++) {
    posts[i]._id = posts[i]._id.toString();
  }
  return {
    props: { posts, rmassage: context.query.massage || "" },
  };
}
