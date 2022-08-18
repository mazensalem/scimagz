import React, { useState } from "react";
import dynamic from "next/dynamic";
import client from "../lib/mongodbconn";
import { ObjectId } from "mongodb";
import { getSession } from "next-auth/react";
import Router from "next/router";
import { Alert, Button, Form } from "react-bootstrap";

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
  const [massage, setmassage] = useState("");
  return (
    <div>
      {massage && (
        <Alert
          variant={massage == "Done" ? "success" : "danger"}
          className="mx-2 w-md-1 ms-md-5"
          onClose={() => {
            setmassage("");
          }}
          dismissible
        >
          {massage}
        </Alert>
      )}
      <Form>
        <Form.Group className="mb-3 ms-2">
          <Form.Label>Header</Form.Label>
          <Form.Control
            type="text"
            placeholder="title"
            style={{ width: "80%" }}
            value={coursname}
            onChange={(e) => setcoursname(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3 ms-2">
          <Form.Label>Course</Form.Label>
          <CustomEditor
            container="postbody"
            setContent={settext}
            content={text}
            readonly={false}
          />
          <div className="border border-1 me-2" id="postbody"></div>
        </Form.Group>
        <Button
          onClick={async () => {
            const post = await sendcourse(setcoursid, text, coursname, "text");
            if (coursid == null) {
              setcoursid(post);
            }
            setmassage("Done");
            Router.push("/?massage=Done");
          }}
          className="ms-2"
          variant="outline-success"
        >
          Send text
        </Button>
      </Form>
      {/* <input
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
      </button> */}
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const cl = await client;
  const db = await cl.db();
  const ucol = await db.collection("users");
  const user = await ucol.findOne({ email: session.user.email });
  if (context.query.id) {
    const postcol = await db.collection("courses");
    const r = await postcol.findOne({ _id: ObjectId(context.query.id) });
    const session = await getSession({ req });
    if (user.role != "Student") {
      if (r.user_email === session.user.email) {
        return {
          props: {
            rcoursid: context.query.id,
            rtext: r.text,
            rcoursename: r.name,
          },
        };
      } else {
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }
    } else {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
  } else {
    if (user.role != "Student"){

      return {
        props: {
          rpostid: null,
          rtext: '{"blocks": []}',
          rpostname: "",
        },
      };
    }
  }
}
