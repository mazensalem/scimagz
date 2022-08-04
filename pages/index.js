import client from "../lib/mongodbconn";
import Post from "../components/Post";

export default function Home({ posts }) {
  return (
    <div>
      <div>
        {posts ? (
          posts.map((post) => (
            <>
              <Post post={post} sector="posts" />
            </>
          ))
        ) : (
          <>no posts is here yet</>
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
    props: { posts },
  };
}
