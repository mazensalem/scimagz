import { ObjectId } from "mongodb";
import React from "react";
import client from "../../lib/mongodbconn";
import RichReader from "../../components/Textreader";
import { Typography } from "@mui/material";
import Router from "next/router";

export default function Course({ course, userid }) {
  return (
    <div>
      <Typography variant="h3" component="h1">
        {course.name}
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
        onClick={() => {
          Router.push("/user/" + userid);
        }}
      >
        by {course.user_email}
      </Typography>
      <RichReader content={JSON.parse(course.text)} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const id = context.query.id;
  const cl = await client;
  const db = await cl.db();
  const ccol = await db.collection("courses");
  const ucol = await db.collection("users");
  const course = await ccol.findOne({ _id: ObjectId(id) });
  const ucourse = await ucol.findOne({ email: course.user_email });
  if (course) {
    course._id = null;
    return { props: { course, userid: ucourse._id.toString() } };
  } else {
    context.res.writeHead(302, {
      Location: "/",
      "Cache-Control": "max-age=0",
    });
  }
}
