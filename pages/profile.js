import { getSession, useSession } from "next-auth/react";

import dynamic from "next/dynamic";
import { useState } from "react";
import client from "../lib/mongodbconn";
import NextRouter from "next/router";
import {
  Dropdown,
  ToastContainer,
  Toast,
  Button,
  Alert,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import Card from "react-bootstrap/Card";

const CustomEditor = dynamic(() => import("../components/richtext"), {
  ssr: false,
});

async function send(content, sector) {
  const data = await fetch("/api/updateuser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content, sector }),
  }).then((x) => x.json());
  return data.content;
}
async function deletePost(postid) {
  const data = await fetch("/api/deletepost", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postid }),
  }).then((x) => x.json());
  return data.content == "Done";
}
async function deleteCourse(courseid) {
  const data = await fetch("/api/deletecourse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courseid }),
  }).then((x) => x.json());
  return data.content == "Done";
}
export default function Profile({ user, posts, penddingapproval, courses }) {
  const [content, setContent] = useState(user.bio || "{}");
  const [editbiostate, seteditbiostate] = useState(user.bio ? false : true);
  const [userrole, setuserrole] = useState("");
  const [massages, setmassages] = useState("");
  const [roleloading, setroleloading] = useState(false);
  const [bioloading, setbioloading] = useState(false);

  const { status } = useSession({
    required: true,
  });

  if (status === "loading") {
    return "loading";
  }

  return (
    <>
      <div className="w-100 mx-auto text-center">
        <>
          {massages == "Something went wrong" ? (
            <Alert variant="danger" onClose={() => setmassages("")} dismissible>
              Something went wrong
            </Alert>
          ) : (
            massages && (
              <Alert
                variant="success"
                onClose={() => setmassages("")}
                dismissible
              >
                {massages}
              </Alert>
            )
          )}
        </>

        {userrole && (
          <ToastContainer className="p-3" position="middle-center">
            <Toast>
              <Toast.Header closeButton={false}>
                <strong className="me-auto">
                  Are you Sure you want to be{" "}
                  {userrole == "Student" ? "a student" : "an instructor"}
                </strong>
              </Toast.Header>
              <Toast.Body className="text-start">
                {roleloading ? (
                  <Spinner variant="dark" animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                ) : (
                  <Button
                    onClick={async () => {
                      setroleloading(true);
                      const result = await send(userrole, "role");
                      if (result == "Done") {
                        user.role = userrole;
                        user.status = "Pending Confirmation";
                        setmassages(
                          "You have successfully confirmed your role"
                        );
                      } else {
                        setmassages("Something went wrong");
                      }
                      setuserrole("");
                      setroleloading(false);
                    }}
                    className="me-1"
                  >
                    Confirm
                  </Button>
                )}
                <Button onClick={() => setuserrole("")}>Dismiss</Button>
              </Toast.Body>
            </Toast>
          </ToastContainer>
        )}

        <div className="d-md-flex">
          {/* The top card */}
          <div className="ms-md-4 mt-md-5">
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
              {user.role ? (
                `${user.status} ${
                  user.role == "Student" ? "Student" : "Instructor"
                }`
              ) : (
                <div>
                  <Dropdown>
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                      Select your role
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => setuserrole("Student")}>
                        Student
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => setuserrole("hInstructor")}>
                        Instructor
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => setuserrole("Instructor")}>
                        Instructor (will review other posts)
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              )}
            </div>
          </div>

          <div className="d-md-flex flex-md-wrap">
            {/* Bio */}
            <Card bg="dark" text="white" className="ProfileCard mt-5 mx-auto">
              <Card.Header className="d-flex justify-content-between align-items-center">
                About Me
                {user.bio && (
                  <Button
                    variant="outline-light"
                    onClick={() => {
                      setContent(user.bio);
                      seteditbiostate(!editbiostate);
                    }}
                    className="float-end"
                  >
                    {editbiostate ? "discard" : "edit"}
                  </Button>
                )}
              </Card.Header>
              <Card.Body>
                <Card.Text>
                  {content == "{}" || editbiostate ? null : (
                    <>
                      <CustomEditor
                        setContent={setContent}
                        content={content}
                        readonly={true}
                        container="bioviewer"
                      />
                      <div id="bioviewer"></div>
                    </>
                  )}

                  {/* The editor of the bio */}
                  <div
                    style={{
                      display:
                        content != "{}" && !editbiostate ? "none" : "block",
                    }}
                  >
                    <CustomEditor
                      setContent={setContent}
                      content={content}
                      readonly={false}
                      container="bioeditor"
                    />
                    <div id="bioeditor"></div>
                    {bioloading ? (
                      <Spinner variant="light" animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    ) : (
                      <Button
                        variant="outline-light"
                        onClick={async () => {
                          setbioloading(true);
                          const result = await send(content, "bio");
                          if (result == "Done") {
                            user.bio = content;
                            seteditbiostate(false);
                            setmassages(
                              "you have successfully changed your bio"
                            );
                          } else {
                            setmassages("Something went wrong");
                          }
                          setbioloading(false);
                        }}
                      >
                        save my bio
                      </Button>
                    )}
                  </div>
                </Card.Text>
              </Card.Body>
            </Card>

            {/* Your Posts */}
            <Card className="ProfileCard mt-5 mx-auto text-start">
              <Card.Header className="d-flex justify-content-between align-items-center">
                Your Posts
                <Button
                  variant="outline-dark"
                  as="a"
                  href="/sendart"
                  className="float-end"
                >
                  Add Post
                </Button>
              </Card.Header>
              <ListGroup variant="flush">
                {posts.map((post) => (
                  <ListGroup.Item
                    key={post._id}
                    className="d-flex justify-content-between"
                  >
                    <div>
                      <a href={"/sendart?id=" + post._id}>
                        {post.name || "untitled"}
                      </a>
                      ({post.status})
                    </div>
                    <Button
                      variant="danger"
                      onClick={() =>
                        deletePost(post._id)
                          ? NextRouter.push("/?massage=postdeleted")
                          : setmassages("Something went wrong")
                      }
                    >
                      delete
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>

            {/* Your Courses */}
            {user.role != "Student" && (
              <Card className="ProfileCard mt-5 mx-auto text-start">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  Your Courses
                  <Button
                    variant="outline-dark"
                    as="a"
                    href="/sendcours"
                    className="float-end"
                  >
                    Add Course
                  </Button>
                </Card.Header>
                <ListGroup variant="flush">
                  {courses.map((course) => (
                    <ListGroup.Item
                      key={course._id}
                      className="d-flex justify-content-between"
                    >
                      <a href={"/sendcours?id=" + course._id}>
                        {course.name || "untitled"}
                      </a>
                      <Button
                        variant="danger"
                        onClick={() =>
                          deleteCourse(course._id)
                            ? NextRouter.push("/?massage=coursedeleted")
                            : setmassages("Something went wrong")
                        }
                      >
                        delete
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card>
            )}

            {user.role == "Instructor" && (
              <>
                {/* Users to review */}
                <Card className="ProfileCard mt-5 mx-auto text-start">
                  <Card.Header>Users to review</Card.Header>
                  <ListGroup variant="flush">
                    {penddingapproval.users.map((user) => (
                      <ListGroup.Item
                        key={user._id}
                        className="d-flex justify-content-between"
                      >
                        <a href={"/revart?sector=user&id=" + user._id}>
                          {user.name}
                        </a>
                        <p>{user.status}</p>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card>

                {/* Posts to review */}
                <Card className="ProfileCard mt-5 mx-auto text-start">
                  <Card.Header>Posts to review</Card.Header>
                  <ListGroup variant="flush">
                    {penddingapproval.posts.map((post) => (
                      <ListGroup.Item
                        key={post._id}
                        className="d-flex justify-content-between"
                      >
                        <a href={"/revart?sector=post&id=" + post._id}>
                          {post.name || "untitled"}
                        </a>
                        <p>{post.status}</p>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  let user, posts, penddingapproval, courses;
  const { req } = context;
  const cl = await client;
  const db = await cl.db();
  const ucol = await db.collection("users");
  const pcol = await db.collection("posts");
  const ccol = await db.collection("courses");
  const session = await getSession({ req });
  if (session) {
    user = await ucol.findOne({ email: session.user.email });
    const rposts = await pcol.find({ user_email: session.user.email });
    posts = await rposts.toArray();
    for (let i = 0; i < posts.length; i++) {
      posts[i]._id = posts[i]._id.toString();
    }
    user._id = null;
    const rpuser = await ucol.find({ approvedby: session.user.email });
    const rpposts = await pcol.find({ approvedby: session.user.email });
    const puser = await rpuser.toArray();
    const pposts = await rpposts.toArray();
    for (let i = 0; i < pposts.length; i++) {
      pposts[i]._id = pposts[i]._id.toString();
    }
    for (let i = 0; i < puser.length; i++) {
      puser[i]._id = puser[i]._id.toString();
    }

    penddingapproval = {
      users: puser,
      posts: pposts,
    };

    const rcourses = await ccol.find({ user_email: session.user.email });
    courses = await rcourses.toArray();

    for (let i = 0; i < courses.length; i++) {
      courses[i]._id = courses[i]._id.toString();
    }
  } else {
    return {
      props: {
        user: {
          bio: "",
        },
      },
    };
  }
  return {
    props: { user: user || {}, posts, penddingapproval, courses },
  };
}
