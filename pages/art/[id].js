import { ObjectId } from "mongodb";
import React from "react";
import client from "../../lib/mongodbconn";
import RichReader from "../../components/Textreader";
import { getSession } from "next-auth/react";
import { Typography } from "@mui/material";
import Router from "next/router";

export default function Post({ post, isrevewing, userid }) {
  return (
    <div>
      {isrevewing ? (
        <>
          <p>you are revewing this articale</p>
          <a href={"/revart/?sector=post&id=" + post._id} target="blank">
            send a Reveiw
          </a>
        </>
      ) : null}
      <br />
      <Typography variant="h3" component="h1">
        {post.name}
      </Typography>
      <Typography
        component="h2"
        style={{
          fontWeight: "bold",
          fontSize: 14,
          color: "gray",
          cursor: "pointer",
          width: "max-content",
        }}
        onClick={() => Router.push("/user/" + userid)}
      >
        by {post.user_email}
      </Typography>
      <RichReader content={JSON.parse(post.text)} />
      <object
        type="application/pdf"
        width="100%"
        height="500px"
        data={post.file.url}
      ></object>
      <a href={post.file.url}>Open</a>
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
      return { props: { post, isrevewing: true } };
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
}
