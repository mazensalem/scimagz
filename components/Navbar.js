import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";

export default function Navcom() {
  let { data: session, status } = useSession();
  const pathname = useRouter().pathname;
  return (
    <Navbar bg="dark" variant="dark" expand="md" className="mb-4">
      <Container>
        <Navbar.Brand href="/">
          <img
            src="/logo.jpg"
            width="30"
            height="30"
            className="d-inline-block align-top mx-1"
            alt="SMZ logo"
          />
          SMZ
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              className={pathname == "/courses" && "active"}
              href="/courses"
            >
              Courses
            </Nav.Link>
            <Nav.Link
              className={pathname == "/sendart" && "active"}
              href="/sendart"
            >
              Send Artical
            </Nav.Link>
            <Nav.Link
              className={pathname == "/profile" && "active"}
              href="/profile"
            >
              Profile
            </Nav.Link>
            <Nav.Link
              className={pathname == "/aboutus" && "active"}
              href="/aboutus"
            >
              About Us
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Item>
              {status == "loading" ? (
                <>
                  <Spinner variant="light" animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </>
              ) : session ? (
                <>
                  <Button
                    onClick={() => signOut()}
                    className="d-none d-md-block"
                    variant="outline-danger"
                  >
                    Logout
                  </Button>
                  <Nav.Link
                    className="d-block d-md-none text-danger"
                    onClick={() => signOut()}
                  >
                    Logout
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => signIn()}
                    className="d-none d-md-block"
                    variant="outline-success"
                  >
                    Login
                  </Button>
                  <Nav.Link
                    className="d-block d-md-none text-success"
                    onClick={() => signIn()}
                  >
                    Login
                  </Nav.Link>
                </>
              )}
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
