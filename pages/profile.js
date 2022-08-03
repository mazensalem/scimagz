import { getSession, useSession } from "next-auth/react";

import dynamic from "next/dynamic";
import { useState } from "react";
import client from "../lib/mongodbconn";
import NextRouter from "next/router";

const CustomEditor = dynamic(() => import("../components/richtext"), {
  ssr: false,
});

async function send(content, sector) {
  const data = await fetch("/api/updateuser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content, sector }),
  }).then((x) => x.json());
  return data.content;
}
async function deletePost(postid) {
  const data = await fetch("/api/deletepost", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postid }),
  }).then((x) => x.json());
  return data.content == "Done";
}
export default function Profile({ user, posts, penddingapproval }) {
  const [content, setContent] = useState(user.bio || "{}");
  const [editbiostate, seteditbiostate] = useState(user.bio ? false : true);
  const [userrole, setuserrole] = useState(user.role || "Student");

  const { status } = useSession({
    required: true,
  });

  if (status === "loading") {
    return "loading";
  }

  return (
    <>
      <img alt="users image" src={user.image} />
      <strong>{user.name}</strong>
      <span>{user.email}</span>
      <div>
        {user.role ? (
          "you are " + user.role + " and you are " + user.status
        ) : (
          <div>
            <select onChange={(e) => setuserrole(e.target.value)}>
              <option>Student</option>
              <option>Instructor</option>
            </select>
            <button
              onClick={async () => {
                const r = confirm("Are you sure you want to be a " + userrole);
                if (r) {
                  const result = await send(userrole, "role");
                  if (result == "Done") {
                    user.role = userrole;
                    setuserrole(null);
                  } else {
                    alert("Error");
                  }
                }
              }}
            >
              send role
            </button>
          </div>
        )}
      </div>
      {/* About you */}
      <div
        style={{
          padding: 10,
          border: "1px solid",
          width: "900px",
          height: "300px",
          margin: "auto",
          overflowY: "auto",
        }}
      >
        <span>Tell Us about you</span>
        <div>
          {user.bio && (
            <button
              onClick={() => {
                setContent(user.bio);
                seteditbiostate(!editbiostate);
              }}
            >
              {editbiostate ? "discard" : "edit"}
            </button>
          )}

          <div style={{ display: content != "{}" && !editbiostate && "none" }}>
            <CustomEditor setContent={setContent} content={content} />
            <button
              onClick={async () => {
                const result = await send(content, "bio");
                if (result == "Done") {
                  user.bio = content;
                  seteditbiostate(false);
                } else {
                  alert("Error try again");
                }
              }}
            >
              save my bio
            </button>
          </div>

          <div style={{ display: (content == "{}" || editbiostate) && "none" }}>
            {JSON.parse(
              content == "{}" ? '{"blocks": []}' : content
            ).blocks.map((value) => {
              if (value.type === "paragraph") {
                return <p>{value.data.text}</p>;
              }
            })}
          </div>
        </div>
      </div>
      {/* Your Posts*/}
      <div>
        {posts.map((post) => (
          <div>
            <strong>{post.name}</strong>
            <button
              onClick={() =>
                deletePost(post._id) ? NextRouter.push("/") : alert("Error")
              }
            >
              delete
            </button>
          </div>
        ))}
      </div>
      {/* Pendding Approvals*/}
      <div>
        <div>
          <h1>Users</h1>
          {penddingapproval.users.map((user) => (
            <div>{user.name}</div>
          ))}
        </div>
        <div>
          <h1>posts</h1>
          {penddingapproval.posts.map((post) => (
            <div>{post.name}</div>
          ))}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  let user, posts, penddingapproval;
  const { req } = context;
  const cl = await client;
  const db = await cl.db();
  const ucol = await db.collection("users");
  const pcol = await db.collection("posts");
  const session = await getSession({ req });
  if (session) {
    user = await ucol.findOne({ email: session.user.email });
    const rposts = await pcol.find({ user_email: session.user.email });
    posts = await rposts.toArray();
    for (let i = 0; i < posts.length; i++) {
      posts[i]._id = posts[i]._id.toString();
    }
    user._id = null;
    const rpuser = await ucol.find({ approvedby: session.user.email });
    const rpposts = await pcol.find({ approvedby: session.user.email });
    const puser = await rpuser.toArray();
    const pposts = await rpposts.toArray();
    for (let i = 0; i < pposts.length; i++) {
      pposts[i]._id = pposts[i]._id.toString();
    }
    for (let i = 0; i < puser.length; i++) {
      puser[i]._id = puser[i]._id.toString();
    }

    penddingapproval = {
      users: puser,
      posts: pposts,
    };
  }

  return {
    props: { user: user || {}, posts, penddingapproval },
  };
}
