import { getSession, useSession } from "next-auth/react";

import dynamic from "next/dynamic";
import { useState } from "react";
import client from "../lib/mongodbconn";
import NextRouter from "next/router";
import Textreader from "../components/Textreader";

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
async function deleteCourse(courseid) {
  const data = await fetch("/api/deletecourse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courseid }),
  }).then((x) => x.json());
  return data.content == "Done";
}
export default function Profile({ user, posts, penddingapproval, courses }) {
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
      {/* sidebar right */}
      <div name="sidebar" style={{ width: "25%", marginTop: "10px" }}>
        <div
          style={{
            width: "100%",
            height: 100,
            margin: "auto",
            textAlign: "center",
          }}
        >
          <img
            alt="users image"
            src={user.image}
            referrerPolicy="no-referrer"
          />
          <div>
            <strong>{user.name}</strong>
          </div>
          <div>{user.email}</div>

          <div>
            {user.role ? (
              "you are " + user.role + " and you are " + user.status
            ) : (
              <div>
                <select onChange={(e) => setuserrole(e.target.value)}>
                  <option>Student</option>
                  <option value="hinstructor">Instructor</option>
                  <option value="Instructor">
                    Instructor (will review other posts)
                  </option>
                </select>
                <button
                  onClick={async () => {
                    const r = confirm(
                      "Are you sure you want to be a " +
                        (userrole == "Student" ? "Student" : "Instructor")
                    );
                    if (r) {
                      const result = await send(userrole, "role");
                      if (result == "Done") {
                        user.role = userrole;
                        user.status = "Pending Confirmation";
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
        </div>
      </div>

      {/* sidebar left */}
      <div style={{ width: "75%", float: "right" }}>
        {/* The container of the bio system */}
        <div
          style={{
            padding: 10,
            border: "1px solid",
            width: "50%",
            height: "300px",
            overflowY: "auto",
            float: "left",
          }}
        >
          <span>Tell Us about you</span>
          <div>
            {/* The Edit button */}
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

            {/* view of the bio */}
            <div>
              {content == "{}" || editbiostate ? null : (
                <>
                  <CustomEditor
                    setContent={setContent}
                    content={content}
                    readonly={true}
                    container="bioviewer"
                  />
                  <div id="bioviewer"></div>
                </>
              )}
            </div>

            {/* The editor of the bio */}
            <div
              style={{
                display: content != "{}" && !editbiostate ? "none" : "block",
              }}
            >
              <CustomEditor
                setContent={setContent}
                content={content}
                readonly={false}
                container="bioeditor"
              />
              <div id="bioeditor"></div>
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
          </div>
        </div>
        <div>
          <h1>Posts</h1>
          <div>
            {posts.map((post) => (
              <div key={post._id}>
                <a href={"/sendart?id=" + post._id}>{post.name}</a>
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
        </div>

        <div>
          <h1>courses</h1>
          <div>
            {courses.map((course) => (
              <div key={course._id}>
                <a href={"/sendcours?id=" + course._id}>{course.name}</a>
                <button
                  onClick={() =>
                    deleteCourse(course._id)
                      ? NextRouter.push("/")
                      : alert("Error")
                  }
                >
                  delete
                </button>
              </div>
            ))}
          </div>
        </div>
        <br />
        <br />
        <div>
          <div>
            <h1>Users to review</h1>
            {penddingapproval.users.map((user) => (
              <div key={user._id}>
                <a href={"/revart?sector=user&id=" + user._id}>{user.name}</a>{" "}
                {user.status}
              </div>
            ))}
          </div>
          <div>
            <h1>posts to review</h1>
            {penddingapproval.posts.map((post) => (
              <div key={post._id}>
                <a href={"/revart?sector=post&id=" + post._id}>{post.name}</a>{" "}
                {post.status}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  let user, posts, penddingapproval, courses;
  const { req } = context;
  const cl = await client;
  const db = await cl.db();
  const ucol = await db.collection("users");
  const pcol = await db.collection("posts");
  const ccol = await db.collection("courses");
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

    const rcourses = await ccol.find({ user_email: session.user.email });
    courses = await rcourses.toArray();

    for (let i = 0; i < courses.length; i++) {
      courses[i]._id = courses[i]._id.toString();
    }
  }
  return {
    props: { user: user || {}, posts, penddingapproval, courses },
  };
}

// {
//   "blocks":
//      [
//       {"id":"FQK06YSu-j","type":"paragraph","data":{"text":"Hello my name is"}},
//       {"id":"KKtIL_gGEN","type":"header","data":{"text":"Mazen Salem","level":1}},
//       {"id":"MtqHNuX3fC","type":"paragraph","data":{"text":"and I am the <b>Developer </b>for this site"}},
//       {"id":"U2kcOW9Fjg","type":"paragraph","data":{"text":"and the<b> co-founder</b> <i>here</i>"}},
//       {"id":"7Gnn4h4C8n","type":"paragraph","data":{"text":"this is from my local machine"}},
//       {"id":"vLRXDaVWUx","type":"paragraph","data":{"text":"Hello Again"}}
//     ]
// }
