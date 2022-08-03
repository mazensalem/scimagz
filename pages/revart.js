import { ObjectId } from "mongodb";
import { getSession } from "next-auth/react";
import client from "../lib/mongodbconn";
import Route from "next/router";

async function sendrev(id, sector, content) {
  const cont = await fetch("/api/sendrev", {
    method: "POST",
    body: JSON.stringify({ id, sector, content }),
  }).then((x) => x.json());
  return cont;
}

export default function revart({ id, sector }) {
  return (
    <div>
      <button
        onClick={() => {
          sendrev(id, sector, "Approved");
          Route.push("/");
        }}
      >
        Approved
      </button>
      <button
        onClick={() => {
          sendrev(id, sector, "denied");
          Route.push("/");
        }}
      >
        denied
      </button>
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
        context.res.writeHead(302, {
          Location: "/",
          "Cache-Control": "max-age=0",
        });
      }
    } else if (sector == "user") {
      const ucol = await db.collection("users");
      const user = await ucol.findOne({ _id: ObjectId(id) });
      if (
        user.approvedby === session.user.email &&
        user.status == "Pending confirmation"
      ) {
        return { props: { id, sector } };
      } else {
        context.res.writeHead(302, {
          Location: "/",
          "Cache-Control": "max-age=0",
        });
      }
    } else {
      context.res.writeHead(302, {
        Location: "/",
        "Cache-Control": "max-age=0",
      });
    }
  } else {
    context.res.writeHead(302, {
      Location: "/",
      "Cache-Control": "max-age=0",
    });
  }
}
