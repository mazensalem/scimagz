import { useSession, signIn, signOut } from "next-auth/react";
import client from "../lib/mongodbconn";

export default function Home({ posts }) {
  const { data: session } = useSession();
  console.log(posts);
  return (
    <div>
      <div>
        {session ? (
          <button onClick={() => signOut()}>sign out</button>
        ) : (
          <button onClick={() => signIn()}>sign in</button>
        )}
      </div>
      <div>
        {posts.map((post) => (
          <>
            <p>
              <a href={"/art/" + post._id.toString()}>
                {post.name} &nbsp;&nbsp;&nbsp;&nbsp;
                <span>{post.user_email}</span>
              </a>
            </p>
          </>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const cl = await client;
  const db = await cl.db();
  const col = await db.collection("posts");
  const rposts = await col.find({});
  const posts = await rposts.toArray();
  for (let i = 0; i < posts.length; i++) {
    posts[i]._id = posts[i]._id.toString();
  }
  return {
    props: { posts },
  };
}
