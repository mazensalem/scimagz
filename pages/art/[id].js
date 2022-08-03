import { ObjectId } from "mongodb";
import React from "react";
import client from "../../lib/mongodbconn";

export default function Post({ post }) {
  console.log(post);
  return <div></div>;
}

export async function getServerSideProps(context) {
  const id = context.query.id;
  const cl = await client;
  const db = await cl.db();
  const pcol = await db.collection("posts");
  const post = await pcol.findOne({ _id: ObjectId(id) });
  if (post) {
    post._id = null;
  }
  return { props: { post } };
}
