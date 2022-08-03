import { ObjectId } from "mongodb";
import { getSession } from "next-auth/react";
import client from "../../lib/mongodbconn";

export default async (req, res) => {
  const session = await getSession({ req });
  if (session) {
    const cl = await client;
    const db = await cl.db();
    if (JSON.parse(req.body).sector == "user") {
      const col = await db.collection("users");
      const user = await col.findOne({
        _id: ObjectId(JSON.parse(req.body).id),
      });
      if (user.approvedby == session.user.email) {
        await col.replaceOne(
          { _id: ObjectId(JSON.parse(req.body).id) },
          {
            ...user,
            status: JSON.parse(req.body).content,
          }
        );
      }
    } else if (JSON.parse(req.body).sector == "post") {
      const col = await db.collection("posts");
      const post = await col.findOne({
        _id: ObjectId(JSON.parse(req.body).id),
      });
      if (post.approvedby == session.user.email) {
        await col.replaceOne(
          { _id: ObjectId(JSON.parse(req.body).id) },
          {
            ...post,
            status: JSON.parse(req.body).content,
          }
        );
      }
    }
  }
};
