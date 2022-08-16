import { ObjectId } from "mongodb";
import React from "react";
import client from "../../lib/mongodbconn";
import RichReader from "../../components/Textreader";
import { Card } from "react-bootstrap";
import Router from "next/router";
import dynamic from "next/dynamic";

const CustomEditor = dynamic(() => import("../../components/richtext"), {
  ssr: false,
});
export default function Course({ course, userid }) {
  return (
    <div>
      <div className="w-80 mx-auto mx-md-0">
        <Card className="container-fluid bg-dark text-white Titlewidth text-center float-start float-md-none mx-2">
          <Card.Title>{course.name}</Card.Title>
        </Card>

        <div
          style={{ cursor: "pointer" }}
          className="mx-2"
          onClick={() => Router.push("/user/" + userid)}
        >
          by {course.user_email}
        </div>
      </div>

      <br />
      <h3 className="ps-2">Summary</h3>
      <CustomEditor
        setContent={() => {}}
        content={course.text}
        readonly={true}
        container="postbody"
      />
      <div className="mx-auto w-80" id="postbody"></div>
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
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}
