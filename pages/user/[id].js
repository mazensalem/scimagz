import { ObjectId } from "mongodb";
import React from "react";
import client from "../../lib/mongodbconn";
import dynamic from "next/dynamic";
import { ListGroup, Card } from "react-bootstrap";

const CustomEditor = dynamic(() => import("../../components/richtext"), {
  ssr: false,
});

export default function User({ user, posts, courses }) {
  return (
    <>
      <div className="d-md-flex w-100 mx-auto">
        {/* The top card */}
        <div className="ms-md-4 mt-md-5 text-center">
          <img
            className="rounded-circle"
            alt="users image"
            src={user.image}
            referrerPolicy="no-referrer"
          />
          <Card
            bg="dark"
            text="white"
            className="mt-1 rounded-pill mx-auto"
            style={{ width: "max-content" }}
            variant="flush"
          >
            <Card.Header>{user.name}</Card.Header>
          </Card>
          <div>
            {user.email}
            <br />
            {`${user.status} ${
              user.role == "Student" ? "Student" : "Instructor"
            }`}
          </div>
        </div>

        <div className="d-md-flex w-100 flex-md-wrap ms-2">
          {/* Bio */}
          <Card bg="dark" text="white" className="ProfileCard mt-5 mx-auto">
            <Card.Header className="d-flex justify-content-between align-items-center">
              About Me
            </Card.Header>
            <Card.Body>
              <Card.Text as="div">
                <>
                  <CustomEditor
                    content={user.bio}
                    readonly={true}
                    container="bioviewer"
                  />
                  <div id="bioviewer"></div>
                </>
              </Card.Text>
            </Card.Body>
          </Card>

          {/* Your Posts */}
          <Card className="ProfileCard mt-5 mx-auto text-start">
            <Card.Header>Posts</Card.Header>
            <ListGroup variant="flush">
              {posts.map((post) => (
                <ListGroup.Item
                  key={post._id}
                  className="d-flex justify-content-between"
                >
                  <a href={"/sendart?id=" + post._id}>
                    {post.name || "untitled"}
                  </a>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>

          {/* Your Courses */}
          {user.role != "Student" && (
            <Card className="ProfileCard mt-5 mx-auto text-start">
              <Card.Header>Your Courses</Card.Header>
              <ListGroup variant="flush">
                {courses.map((course) => (
                  <ListGroup.Item
                    key={course._id}
                    className="d-flex justify-content-between"
                  >
                    <a href={"/course/" + course._id}>
                      {course.name || "untitled"}
                    </a>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const id = context.query.id;
  const cl = await client;
  const db = await cl.db();
  const ucol = await db.collection("users");
  const pcol = await db.collection("posts");
  const ccol = await db.collection("courses");
  const user = await ucol.findOne({ _id: ObjectId(id) });
  if (!user) {
    return {
      redirect: {
        destination: "/?massage=noufound",
        permanent: false,
      },
    };
  }
  const rp = await pcol.find({ user_email: user.email });
  const posts = await rp.toArray();
  const rc = await ccol.find({ user_email: user.email });
  const courses = await rc.toArray();
  for (let i = 0; i < posts.length; i++) {
    posts[i]._id = posts[i]._id.toString();
  }
  for (let i = 0; i < courses.length; i++) {
    courses[i]._id = courses[i]._id.toString();
  }
  user._id = null;
  return { props: { user, posts, courses } };
}
