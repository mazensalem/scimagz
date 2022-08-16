import React from "react";
import { Card, Badge } from "react-bootstrap";

export default function aboutus() {
  return (
    <div className="mx-auto w-100 text-center text-md-start ps-md-4">
      <div>
        <h1>Our Story</h1>
        <img
          src="/ourstory.jpeg"
          alt="ourstory"
          width={274}
          height={274}
          style={{ border: "1px solid black" }}
          className="float-md-start me-md-5"
        />
        <div className="mx-auto w-50 mt-5">
          <h4>header</h4>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cupiditate
          reiciendis consectetur debitis facere, consequatur eligendi animi
          ratione numquam culpa tempora autem minima hic ullam dignissimos, nam
          illum fugit esse at!
        </div>
      </div>

      <div className="mt-5 pt-5">
        <h1 className="mt-md-5">Our Team</h1>
        <div className="w-100 mx-auto p-2 d-md-flex justify-content-md-between flex-md-wrap">
          <Card className="cardwidth mx-auto bg-dark text-center text-white m-2 p-2 ms-md-5 pt-5 mt-5">
            <img
              className="rounded-circle mx-auto position-absolute top-0 start-50 translate-middle"
              width={80}
              height={80}
              src="/mazensalem.jfif"
            />
            <Card.Title>MAZEN SALEM</Card.Title>
            <div className="d-flex justify-content-center justify-content-md-center">
              <Badge pill bg="secondary" className="me-1">
                CO-FOUNDER
              </Badge>
              <Badge pill bg="secondary">
                WEB DEVELOPER
              </Badge>
            </div>
          </Card>
          <Card className="cardwidth mx-auto bg-dark text-center text-white m-2 p-2 ms-md-5 pt-5 mt-5">
            <img
              className="rounded-circle mx-auto position-absolute top-0 start-50 translate-middle"
              width={80}
              height={80}
              src="/mazensalem.jfif"
            />
            <Card.Title>MAZEN SALEM</Card.Title>
            <div className="d-flex justify-content-center justify-content-md-center">
              <Badge pill bg="secondary" className="me-1">
                CO-FOUNDER
              </Badge>
              <Badge pill bg="secondary">
                WEB DEVELOPER
              </Badge>
            </div>
          </Card>
          <Card className="cardwidth mx-auto bg-dark text-center text-white m-2 p-2 ms-md-5 pt-5 mt-5">
            <img
              className="rounded-circle mx-auto position-absolute top-0 start-50 translate-middle"
              width={80}
              height={80}
              src="/mazensalem.jfif"
            />
            <Card.Title>MAZEN SALEM</Card.Title>
            <div className="d-flex justify-content-center justify-content-md-center">
              <Badge pill bg="secondary" className="me-1">
                CO-FOUNDER
              </Badge>
              <Badge pill bg="secondary">
                WEB DEVELOPER
              </Badge>
            </div>
          </Card>
          <Card className="cardwidth mx-auto bg-dark text-center text-white m-2 p-2 ms-md-5 pt-5 mt-5">
            <img
              className="rounded-circle mx-auto position-absolute top-0 start-50 translate-middle"
              width={80}
              height={80}
              src="/mazensalem.jfif"
            />
            <Card.Title>MAZEN SALEM</Card.Title>
            <div className="d-flex justify-content-center justify-content-md-center">
              <Badge pill bg="secondary" className="me-1">
                CO-FOUNDER
              </Badge>
              <Badge pill bg="secondary">
                WEB DEVELOPER
              </Badge>
            </div>
          </Card>
          <Card className="cardwidth mx-auto bg-dark text-center text-white m-2 p-2 ms-md-5 pt-5 mt-5">
            <img
              className="rounded-circle mx-auto position-absolute top-0 start-50 translate-middle"
              width={80}
              height={80}
              src="/mazensalem.jfif"
            />
            <Card.Title>MAZEN SALEM</Card.Title>
            <div className="d-flex justify-content-center justify-content-md-center">
              <Badge pill bg="secondary" className="me-1">
                CO-FOUNDER
              </Badge>
              <Badge pill bg="secondary">
                WEB DEVELOPER
              </Badge>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
