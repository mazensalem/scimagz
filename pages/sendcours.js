import React, { useState } from "react";
import dynamic from "next/dynamic";
import client from "../lib/mongodbconn";
import { ObjectId } from "mongodb";
import { getSession } from "next-auth/react";
import Router from "next/router";

const CustomEditor = dynamic(() => import("../components/richtext"), {
  ssr: false,
});

async function sendcourse(courseid, text, name) {
  console.log({ courseid, text, name });
  const r = await fetch("/api/sendcourse", {
    method: "POST",
    body: JSON.stringify({ courseid, text, name }),
  }).then((x) => x.json());
  return r.content;
}

export default function Sendart({ rcoursid, rtext, rcoursename }) {
  const [text, settext] = useState(rtext);
  const [coursname, setcoursname] = useState(rcoursename);
  const [coursid, setcoursid] = useState(rcoursid);
  return (
    <div>
      <input
        type="text"
        value={coursname}
        onChange={(e) => setcoursname(e.target.value)}
      />
      <CustomEditor setContent={settext} content={text} />
      <button
        onClick={async () => {
          const course = await sendcourse(coursid, text, coursname);
          if (coursid == null) {
            setcoursid(course);
          }
          Router.push("/");
        }}
      >
        sendtext
      </button>
    </div>
  );
}

export async function getServerSideProps(context) {
  if (context.query.id) {
    const { req } = context;
    const cl = await client;
    const db = await cl.db();
    const postcol = await db.collection("courses");
    const ucol = await db.collection("users");
    const r = await postcol.findOne({ _id: ObjectId(context.query.id) });
    const session = await getSession({ req });
    const user = await ucol.findOne({ email: session.user.email });
    if (user.role == "Instructor") {
      if (r.user_email === session.user.email) {
        return {
          props: {
            rcoursid: context.query.id,
            rtext: r.text,
            rcoursename: r.name,
          },
        };
      } else {
        context.res.writeHead(302, {
          Location: "/",
          "Cache-Control": "max-age=0",
        });
      }
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
        rpostname: "",
      },
    };
  }
}
