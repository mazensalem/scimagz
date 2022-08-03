import { ObjectId } from "mongodb";
import React from "react";
import client from "../../lib/mongodbconn";

export default function User({ user }) {
  console.log(user);
  return <div></div>;
}

export async function getServerSideProps(context) {
  const id = context.query.id;
  const cl = await client;
  const db = await cl.db();
  const ucol = await db.collection("users");
  const user = await ucol.findOne({ _id: ObjectId(id) });
  user._id = null;
  return { props: { user } };
}
