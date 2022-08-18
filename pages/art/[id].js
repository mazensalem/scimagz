import { ObjectId } from "mongodb";
import React from "react";
import client from "../../lib/mongodbconn";
import { getSession } from "next-auth/react";
import Router from "next/router";
import { Alert, Card } from "react-bootstrap";
import dynamic from "next/dynamic";

const CustomEditor = dynamic(() => import("../../components/richtext"), {
  ssr: false,
});

export default function Post({ post, isrevewing, userid }) {
  return (
    <div>
      {isrevewing ? (
        <>
          <Alert variant="dark" className="mx-3">
            you are revewing this articale
            <Alert.Link
              target="blank"
              href={"/revart/?sector=post&id=" + post._id}
            >
              Send a revewing
            </Alert.Link>
          </Alert>
        </>
      ) : null}

      <div className="w-80 mx-auto mx-md-0">
        <Card className="container-fluid bg-dark text-white Titlewidth text-center float-start float-md-none mx-2">
          <Card.Title>{post.name}</Card.Title>
        </Card>

        <div
          style={{ cursor: "pointer" }}
          className="mx-2"
          onClick={() => Router.push("/user/" + userid)}
        >
          by {post.user_email}
        </div>
      </div>

      <br />
      <h3 className="ps-2">Summary</h3>
      <CustomEditor
        setContent={() => {}}
        content={post.text}
        readonly={true}
        container="postbody"
      />
      <div className="mx-auto w-80" id="postbody"></div>

      <br />
      <h3 className="ps-2">File</h3>
      <object
        type="application/pdf"
        width="100%"
        height="500px"
        data={post.file.url}
      ></object>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const id = context.query.id;
  const cl = await client;
  const db = await cl.db();
  const pcol = await db.collection("posts");
  const ucol = await db.collection("users");
  const post = await pcol.findOne({ _id: ObjectId(id) });
  const session = await getSession({ req });
  if (post) {
    if (post.status == "Approved") {
      post._id = post._id.toString();
      const user = await ucol.findOne({ email: post.user_email });
      return {
        props: { post, isrevewing: false, userid: user._id.toString() },
      };
    } else if (
      post.status == "Pending confirmation" &&
      post.approvedby == session.user.email
    ) {
      post._id = post._id.toString();
      const user = await ucol.findOne({ email: post.user_email });
      post.name = post.name || null;
      post.text = post.text || "{}";
      return { props: { post, isrevewing: true, userid: user._id.toString() } };
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
}
