import { getSession, useSession } from "next-auth/react";

import dynamic from "next/dynamic";
import { useState } from "react";
import client from "../lib/mongodbconn";

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

export default function Profile({ user }) {
  const [content, setContent] = useState(user.bio || "{}");
  const [editbiostate, seteditbiostate] = useState(false);
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
          "you are " + user.role + "and you are " + user.status
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

          <div style={{ display: user.bio && !editbiostate && "none" }}>
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

          <div style={{ display: (!user.bio || editbiostate) && "none" }}>
            {JSON.parse(user.bio || "{blocks: []}").blocks.map((value) => {
              if (value.type === "paragraph") {
                return <p>{value.data.text}</p>;
              }
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  let user;
  const { req } = context;
  const cl = await client;
  const db = await cl.db();
  const col = await db.collection("users");
  const session = await getSession({ req });
  if (session) {
    user = await col.findOne({ email: session.user.email });
    user._id = null;
  }

  return {
    props: { user: user || {} },
  };
}
