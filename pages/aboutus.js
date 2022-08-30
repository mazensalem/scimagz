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
          today we would like to announce the mentoring platform for young
          people, which helps spread research and projects. Where we will share
          our discoveries of different inventions In addition to encouraging
          young researchers to delve into topics from various fields of science
          while providing scientific content to readers by writing advanced
          articles on different sciences
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
              style={{ objectFit: "cover" }}
              src="/mahmoud.jpeg"
            />
            <Card.Title>MAHMOUD ABDULGANI</Card.Title>
            <div className="d-flex justify-content-center justify-content-md-center">
              <Badge pill bg="secondary" className="me-1">
                FOUNDER
              </Badge>
              <Badge pill bg="secondary">
                CEO
              </Badge>
            </div>
          </Card>
          <Card className="cardwidth mx-auto bg-dark text-center text-white m-2 p-2 ms-md-5 pt-5 mt-5">
            <img
              className="rounded-circle mx-auto position-absolute top-0 start-50 translate-middle"
              width={80}
              height={80}
              style={{ objectFit: "cover" }}
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
              style={{ objectFit: "cover" }}
              src="/basmala.jpeg"
            />
            <Card.Title>BASMALA ELMAGHRABY</Card.Title>
            <div className="d-flex justify-content-center justify-content-md-center">
              <Badge pill bg="secondary" className="me-1">
                HEAD OF MARKETING
              </Badge>
            </div>
          </Card>
          <Card className="cardwidth mx-auto bg-dark text-center text-white m-2 p-2 ms-md-5 pt-5 mt-5">
            <img
              className="rounded-circle mx-auto position-absolute top-0 start-50 translate-middle"
              width={80}
              height={80}
              style={{ objectFit: "cover" }}
              src="/ahmed.jpeg"
            />
            <Card.Title>AHMED ELHENAWY</Card.Title>
            <div className="d-flex justify-content-center justify-content-md-center">
              <Badge pill bg="secondary" className="me-1">
                CHIEF OPERATION OFFICER
              </Badge>
            </div>
          </Card>
          <Card className="cardwidth mx-auto bg-dark text-center text-white m-2 p-2 ms-md-5 pt-5 mt-5">
            <img
              className="rounded-circle mx-auto position-absolute top-0 start-50 translate-middle"
              width={80}
              height={80}
              style={{ objectFit: "cover" }}
              src="/osha.jpeg"
            />
            <Card.Title>OSHA ALI</Card.Title>
            <div className="d-flex justify-content-center justify-content-md-center">
              <Badge pill bg="secondary" className="me-1">
                VICE HEAD OF MARKETING
              </Badge>
            </div>
          </Card>
          <Card className="cardwidth mx-auto bg-dark text-center text-white m-2 p-2 ms-md-5 pt-5 mt-5">
            <img
              className="rounded-circle mx-auto position-absolute top-0 start-50 translate-middle"
              width={80}
              height={80}
              // style={{ objectFit: "cover" }}
              src="/nada.jpeg"
            />
            <Card.Title>NADA ABDELATIF</Card.Title>
            <div className="d-flex justify-content-center justify-content-md-center">
              <Badge pill bg="secondary" className="me-1">
                VICE HEADER OF MARKETING
              </Badge>
            </div>
          </Card>
          <Card className="cardwidth mx-auto bg-dark text-center text-white m-2 p-2 ms-md-5 pt-5 mt-5">
            <img
              className="rounded-circle mx-auto position-absolute top-0 start-50 translate-middle"
              width={80}
              height={80}
              // style={{ objectFit: "cover" }}
              src="/nour.jpeg"
            />
            <Card.Title>NOURELDEN ELSAEED</Card.Title>
            <div className="d-flex justify-content-center justify-content-md-center">
              <Badge pill bg="secondary" className="me-1">
                HEAD OF GRAPHIC DESIGNING
              </Badge>
            </div>
          </Card>
          <Card className="cardwidth mx-auto bg-dark text-center text-white m-2 p-2 ms-md-5 pt-5 mt-5">
            <img
              className="rounded-circle mx-auto position-absolute top-0 start-50 translate-middle"
              width={80}
              height={80}
              style={{ objectFit: "cover" }}
              src="/omar.jfif"
            />
            <Card.Title>OMAR DOHIM</Card.Title>
            <div className="d-flex justify-content-center justify-content-md-center">
              <Badge pill bg="secondary" className="me-1">
                VICE HEAD OF GRAPHIC DESIGNING
              </Badge>
            </div>
          </Card>
          <Card className="cardwidth mx-auto bg-dark text-center text-white m-2 p-2 ms-md-5 pt-5 mt-5">
            <img
              className="rounded-circle mx-auto position-absolute top-0 start-50 translate-middle"
              width={80}
              height={80}
              style={{ objectFit: "cover" }}
              src="/malk.jpeg"
            />
            <Card.Title>MALAK HAROON</Card.Title>
            <div className="d-flex justify-content-center justify-content-md-center">
              <Badge pill bg="secondary" className="me-1">
                HEAD OF WRITING
              </Badge>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
