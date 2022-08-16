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
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cupiditate
            voluptate ut unde. Officia voluptatem ducimus corrupti quidem
            exercitationem aliquam accusantium porro iste, quas quia non
            expedita, tempore impedit commodi neque.
          </Card.Text>
          <ListGroup className="footercontactlist">
            <ListGroup.Item as="a" href="tel:+0201234567890">
              <FontAwesomeIcon className="mx-1" icon={faPhone} />
              +0201234567890
            </ListGroup.Item>
            <ListGroup.Item as="a" href="mailto:email@gmail.com">
              <FontAwesomeIcon className="mx-1" icon={faMailBulk} />
              email@gmail.com
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
}
