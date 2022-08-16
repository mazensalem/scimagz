import * as React from "react";
import Router from "next/router";
import { Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";

export default function BasicCard({ post, sector }) {
  return (
    <Card className="bg-dark text-white m-2 p-2 w-md-1 ms-md-5">
      <Card.Title>{post.name}</Card.Title>
      <Card.Text>published by {post.user_email}</Card.Text>
      <Button
        className="float-md-end w-md-2"
        variant="outline-light"
        as="a"
        href={(sector == "posts" ? "/art/" : "/course/") + post._id}
      >
        Learn More
      </Button>
    </Card>
  );
}
