import React, { useState } from "react";
import { ImageUpload } from "../components/ImageUploader";
import dynamic from "next/dynamic";
import client from "../lib/mongodbconn";
import { ObjectId } from "mongodb";
import { getSession } from "next-auth/react";

const CustomEditor = dynamic(() => import("../components/richtext"), {
  ssr: false,
});

async function sendart(postid, text, name) {
  const r = await fetch("/api/sendpost", {
    method: "POST",
    body: JSON.stringify({ postid, text, name, sector: "text" }),
  }).then((x) => x.json());
  return r.content;
}

export default function Sendart({ rpostid, rtext, rfile, rpostname }) {
  const [text, settext] = useState(rtext);
  const [file, setfile] = useState(rfile);
  const [postname, setpostname] = useState(rpostname);
  const [postid, setpostid] = useState(rpostid);
  return (
    <div>
      <input
        type="text"
        value={postname}
        onChange={(e) => setpostname(e.target.value)}
      />
      <ImageUpload postid={postid} setContent={setfile} content={file} />
      <CustomEditor setContent={settext} content={text} />
      <button
        onClick={async () => {
          const post = await sendart(postid, text, postname);
          if (postid == null) {
            setpostid(post);
          }
        }}
      >
        sendtext
      </button>
      <button
        onClick={async () => {
          const result = await sendart(file, text);
          console.log(result);
        }}
      >
        send
      </button>
    </div>
  );
}

export async function getServerSideProps(context) {
  if (context.query.id) {
    const { req } = context;
    const cl = await client;
    const db = await cl.db();
    const postcol = await db.collection("posts");
    const r = await postcol.findOne({ _id: ObjectId(context.query.id) });
    const session = await getSession({ req });
    if (r.user_email === session.user.email) {
      return {
        props: {
          rpostid: context.query.id,
          rtext: r.text,
          rfile: r.file,
          rpostname: r.name,
        },
      };
    } else {
      context.res.writeHead(302, {
        Location: "/",
        "Cache-Control": "max-age=0",
      });
    }
  } else {
    return {
      props: {
        rpostid: null,
        rtext: '{"blocks": []}',
        rfile: {},
        rpostname: "",
      },
    };
  }
}
