import { ObjectId } from "mongodb";
import { getSession } from "next-auth/react";
import client from "../lib/mongodbconn";
import Route from "next/router";
import Button from "react-bootstrap/Button";
import { Alert, Spinner } from "react-bootstrap";
import { useState } from "react";

export default function Revart({ id, sector }) {
  const [massage, setmassage] = useState("");
  const [msector, setmsecor] = useState("");
  const [loading, setloading] = useState(false);

  async function sendrev(id, sector, content) {
    const cont = await fetch("/api/sendrev", {
      method: "POST",
      body: JSON.stringify({ id, sector, content }),
    }).then((x) => x.json());
    if (cont.content != "Done") {
      setmassage("Some things went wrong");
      setmsecor("danger");
    }
    return cont.content;
  }

  return (
    <div className="w-100">
      {massage && (
        <Alert
          variant={msector}
          className="mx-2"
          onClose={() => {
            setmassage("");
            setmsecor("");
          }}
          dismissible
        >
          {massage}
        </Alert>
      )}

      <iframe
        className="container-fluid mx-auto mx-md-0 ms-md-3 d-block iframestyle float-md-start"
        src={`/${sector == "post" ? "art" : "user"}/${id}`}
      ></iframe>
      <div className="mt-5 pt-3 text-center">
        <Button
          variant="outline-danger mx-1"
          onClick={() => {
            setloading(true);
            sendrev(id, sector, "denied");
            Route.push(`/?massage=Denied${sector == "post" && "Post"}`);
          }}
          disabled={loading}
        >
          Deniy
        </Button>
        {loading ? (
          <Spinner variant="dark" animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : (
          <Button
            as="a"
            href={`/${sector == "post" ? "art" : "user"}/${id}`}
            variant="outline-info mx-1"
          >
            Go to the page
          </Button>
        )}

        <Button
          onClick={() => {
            setloading(true);
            sendrev(id, sector, "Approved");
            Route.push(`/?massage=Approved${sector == "post" && "Post"}`);
          }}
          variant="outline-success mx-1"
          disabled={loading}
        >
          Accept
        </Button>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const sector = context.query.sector;
  const id = context.query.id;
  const session = await getSession({ req });
  const cl = await client;
  const db = await cl.db();
  if (id) {
    if (sector == "post") {
      const pcol = await db.collection("posts");
      const post = await pcol.findOne({ _id: ObjectId(id) });
      if (
        post.approvedby === session.user.email &&
        post.status == "Pending confirmation"
      ) {
        return { props: { id, sector } };
      } else {
        return {
          redirect: {
            destination: "/?massage=nopost",
            permanent: false,
          },
        };
      }
    } else if (sector == "user") {
      const ucol = await db.collection("users");
      const user = await ucol.findOne({ _id: ObjectId(id) });
      if (
        user.approvedby === session.user.email &&
        user.status == "Pending Confirmation"
      ) {
        return { props: { id, sector } };
      } else {
        return {
          redirect: {
            destination: "/?massage=nouser",
            permanent: false,
          },
        };
      }
    } else {
      return {
        redirect: {
          destination: "/?massage=missing+p",
          permanent: false,
        },
      };
    }
  } else {
    return {
      redirect: {
        destination: "/?massage=missing+p",
        permanent: false,
      },
    };
  }
  return { props: {} };
}
