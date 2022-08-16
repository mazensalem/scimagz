import React, { useState } from "react";
import { ImageUpload } from "../components/ImageUploader";
import dynamic from "next/dynamic";
import client from "../lib/mongodbconn";
import { ObjectId } from "mongodb";
import { getSession } from "next-auth/react";
import Router from "next/router";
import { Button, Form, Alert } from "react-bootstrap";

const CustomEditor = dynamic(() => import("../components/richtext"), {
  ssr: false,
});

async function sendart(postid, text, name, sector) {
  if (sector == "text") {
    const r = await fetch("/api/sendpost", {
      method: "POST",
      body: JSON.stringify({ postid, text, name, sector: "text" }),
    }).then((x) => x.json());
    return r.content;
  } else if (sector == "submit") {
    const r = await fetch("/api/sendpost", {
      method: "POST",
      body: JSON.stringify({ postid, sector: "submit" }),
    }).then((x) => x.json());
    return r.content;
  }
}

export default function Sendart({ rpostid, rtext, rfile, rpostname, rstatus }) {
  const [text, settext] = useState(rtext);
  const [file, setfile] = useState(rfile);
  const [postname, setpostname] = useState(rpostname);
  const [postid, setpostid] = useState(rpostid);
  const [status, setstatus] = useState(rstatus);
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
          massage
        </Alert>
      )}
      <Form>
        <Form.Group className="mb-3 ms-2">
          <Form.Label>Header</Form.Label>
          <Form.Control
            type="text"
            placeholder="title"
            style={{ width: "80%" }}
            value={postname}
            onChange={(e) => setpostname(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3 ms-2">
          <Form.Label>Summary</Form.Label>
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
            const post = await sendart(postid, text, postname, "text");
            if (postid == null) {
              setpostid(post);
            }
            setmassage("Done");
          }}
          className="ms-2"
          variant="outline-success"
        >
          Send text
        </Button>
        <ImageUpload postid={postid} setContent={setfile} content={file} />
        <Button
          onClick={async () => {
            await sendart(postid, "", "", "submit");
            setstatus(status == "draft" ? "Pending confirmation" : "draft");
            Router.push("/?massage=Done");
          }}
          className="ms-2 mt-3"
          variant="outline-success"
        >
          {status == "draft" || status == null
            ? "send for review"
            : "make it draft"}
        </Button>
      </Form>
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
          rfile: r.file || null,
          rpostname: r.name,
          rstatus: r.status,
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
      props: {
        rpostid: null,
        rtext: '{"blocks": []}',
        rfile: {},
        rpostname: "",
        rstatus: null,
      },
    };
  }
}
