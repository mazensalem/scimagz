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
            referrerpolicy="no-referrer"
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
                  <option>Instructor</option>
                </select>
                <button
                  onClick={async () => {
                    const r = confirm(
                      "Are you sure you want to be a " + userrole
                    );
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
        </div>
      </div>

      <div style={{ width: "75%", float: "right" }}>
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

            <div
              style={{ display: content != "{}" && !editbiostate && "none" }}
            >
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

            <div
              style={{ display: (content == "{}" || editbiostate) && "none" }}
            >
              <Textreader
                content={JSON.parse(
                  content == "{}" ? '{"blocks": []}' : content
                )}
              />
            </div>
          </div>
        </div>
        <div>
          <h1>Posts</h1>
          <div>
            {posts.map((post) => (
              <div>
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
              <div>
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
              <div>
                <a href={"/revart?sector=user&id=" + user._id}>{user.name}</a>{" "}
                {user.status}
              </div>
            ))}
          </div>
          <div>
            <h1>posts to review</h1>
            {penddingapproval.posts.map((post) => (
              <div>
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
  console.log(posts);
  console.log(courses);
  console.log(penddingapproval);
  return {
    props: { user: user || {}, posts, penddingapproval, courses },
  };
}

// {
//   users: [
//     {
//       _id: '62ea1a1560a2ca1fbd7737bc',
//       name: 'May Salim',
//       email: 'maysalimf@gmail.com',
//       image: 'https://lh3.googleusercontent.com/a/AItbvmlvQJUbLiXfMb2EFtKiEWFTY4QNn3IJcCf0Isc=s96-c',
//       emailVerified: null,
//       role: 'Instructor',
//       status: 'Approved',
//       approvedby: 'salemmazen27@gmail.com',
//       bio: '{"blocks":[{"id":"6jsBJIzluB","type":"paragraph","data":{"text":"this is my bio 6"}}]}'
//     }
//   ],
//   posts: [
//     {
//       _id: '62ea27d460a2ca1fbd7737be',
//       text: '{"blocks":[{"id":"o_5vwQ05K0","type":"paragraph","data":{"text":"B1"}}]}',
//       name: 'H1',
//       status: 'Approved',
//       user_email: 'maysalimf@gmail.com',
//       approvedby: 'salemmazen27@gmail.com',
//       file: [Object]
//     },
//     {
//       _id: '62eac9a460a2ca1fbd7737c8',
//       text: '{"blocks":[{"id":"nHRcmjph-J","type":"paragraph","data":{"text":"lets go"}}]}',
//       name: 'hallo',
//       status: 'Approved',
//       user_email: 'salemmazen27@gmail.com',
//       approvedby: 'salemmazen27@gmail.com',
//       file: [Object]
//     },
//     {
//       _id: '62eb7f8fc59192bc2b43b8e1',
//       text: '{"blocks":[{"id":"39tETbV2ax","type":"paragraph","data":{"text":"b1"}}]}',
//       name: 'h1',
//       status: 'Pending confirmation',
//       user_email: 'salemmazen27@gmail.com',
//       file: [Object],
//       approvedby: 'salemmazen27@gmail.com'
//     }
//   ]
// }
// [
//   {
//     _id: '62eac9a460a2ca1fbd7737c8',
//     text: '{"blocks":[{"id":"nHRcmjph-J","type":"paragraph","data":{"text":"lets go"}}]}',
//     name: 'hallo',
//     status: 'Approved',
//     user_email: 'salemmazen27@gmail.com',
//     approvedby: 'salemmazen27@gmail.com',
//     file: {
//       url: 'https://res.cloudinary.com/dc1fhdtwe/raw/upload/v1659554224/scimagz/s7xdbue400ei5o4otxfz.pdf',
//       public_id: 'scimagz/s7xdbue400ei5o4otxfz.pdf'
//     }
//   },
//   {
//     _id: '62eb7f8fc59192bc2b43b8e1',
//     text: '{"blocks":[{"id":"39tETbV2ax","type":"paragraph","data":{"text":"b1"}}]}',
//     name: 'h1',
//     status: 'Pending confirmation',
//     user_email: 'salemmazen27@gmail.com',
//     file: {
//       url: 'https://res.cloudinary.com/dc1fhdtwe/raw/upload/v1659604402/scimagz/vjwohqddt1oevy8wqe1f.pdf',
//       public_id: 'scimagz/vjwohqddt1oevy8wqe1f.pdf'
//     },
//     approvedby: 'salemmazen27@gmail.com'
//   }
// ]
// [
//   {
//     _id: '62eaec7ec59192bc2b43b8e0',
//     text: '{"blocks":[{"id":"3YxlWETZYa","type":"embed","data":{"service":"youtube","source":"https://youtu.be/PO6kMafwe8g","embed":"https://www.youtube.com/embed/PO6kMafwe8g","width":580,"height":320,"caption":""}},{"id":"YLC_tD4yNX","type":"paragraph","data":{"text":"hallo"}}]}',
//     name: 'H1',
//     user_email: 'salemmazen27@gmail.com'
//   }
// ]
// {
//   users: [
//     {
//       _id: '62ea1a1560a2ca1fbd7737bc',
//       name: 'May Salim',
//       email: 'maysalimf@gmail.com',
//       image: 'https://lh3.googleusercontent.com/a/AItbvmlvQJUbLiXfMb2EFtKiEWFTY4QNn3IJcCf0Isc=s96-c',
//       emailVerified: null,
//       role: 'Instructor',
//       status: 'Approved',
//       approvedby: 'salemmazen27@gmail.com',
//       bio: '{"blocks":[{"id":"6jsBJIzluB","type":"paragraph","data":{"text":"this is my bio 6"}}]}'
//     }
//   ],
//   posts: [
//     {
//       _id: '62ea27d460a2ca1fbd7737be',
//       text: '{"blocks":[{"id":"o_5vwQ05K0","type":"paragraph","data":{"text":"B1"}}]}',
//       name: 'H1',
//       status: 'Approved',
//       user_email: 'maysalimf@gmail.com',
//       approvedby: 'salemmazen27@gmail.com',
//       file: [Object]
//     },
//     {
//       _id: '62eac9a460a2ca1fbd7737c8',
//       text: '{"blocks":[{"id":"nHRcmjph-J","type":"paragraph","data":{"text":"lets go"}}]}',
//       name: 'hallo',
//       status: 'Approved',
//       user_email: 'salemmazen27@gmail.com',
//       approvedby: 'salemmazen27@gmail.com',
//       file: [Object]
//     },
//     {
//       _id: '62eb7f8fc59192bc2b43b8e1',
//       text: '{"blocks":[{"id":"39tETbV2ax","type":"paragraph","data":{"text":"b1"}}]}',
//       name: 'h1',
//       status: 'Pending confirmation',
//       user_email: 'salemmazen27@gmail.com',
//       file: [Object],
//       approvedby: 'salemmazen27@gmail.com'
//     }
//   ]
// }
