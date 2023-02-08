import React from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { faPhone, faMailBulk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import Router from "next/router";

export default function Footer() {
  return (
    <div className="mt-auto">
      <Card className="mt-4">
        <Card.Header>
          Get connected with us on social networks:
          <div className="float-end float-md-none d-md-inline mx-md-1 w-max-content">
            <FontAwesomeIcon
              onClick={() => Router.push("https://www.facebook.com/scimagz")}
              className="mx-1 mx-md-2 cursor-pointer"
              icon={faFacebook}
            />
            <FontAwesomeIcon
              onClick={() => Router.push("https://www.instgram.com/scimagz")}
              className="mx-1 mx-md-2 cursor-pointer"
              icon={faInstagram}
            />
            <FontAwesomeIcon
              onClick={() =>
                Router.push("https://github.com/mazensalem/scimagz")
              }
              className="mx-1 mx-md-2 cursor-pointer"
              icon={faGithub}
            />
          </div>
        </Card.Header>
        <Card.Body>
          <Card.Title>SCIMAGZ</Card.Title>
          <Card.Text className="footerbody">
            today we would like to announce the mentoring platform for young
            people, which helps spread research and projects. Where we will
            share our discoveries of different inventions In addition to
            encouraging young researchers to delve into topics from various
            fields of science while providing scientific content to readers by
            writing advanced articles on different sciences
          </Card.Text>
          <ListGroup className="footercontactlist">
            <ListGroup.Item as="a" href="tel:+201033332946">
              <FontAwesomeIcon className="mx-1" icon={faPhone} />
              +201033332946
            </ListGroup.Item>
            <ListGroup.Item as="a" href="mailto:scimagz1@gmail.com">
              <FontAwesomeIcon className="mx-1" icon={faMailBulk} />
              scimagz1@gmail.com
            </ListGroup.Item>
            <Card.Img
              src="/E_WEB_04.png"
              style={{ width: "100px", height: "100px" }}
            />
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
}
