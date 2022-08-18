import { getSession } from "next-auth/react";
import client from "../../lib/mongodbconn";
import { ObjectId } from "mongodb";

export default async (req, res) => {
  const session = await getSession({ req });
  if (session) {
    const cl = await client;
    const db = await cl.db();
    const ccol = await db.collection("courses");
    if (JSON.parse(req.body).courseid == null) {
      const r = await ccol.insertOne({
        text: JSON.parse(req.body).text,
        name: JSON.parse(req.body).name,
        user_email: session.user.email,
      });
      res.json({ content: r.insertedId.toString() });
    } else {
      const course = await ccol.findOne({
        _id: ObjectId(JSON.parse(req.body).courseid),
      });
      await ccol.replaceOne(
        { _id: ObjectId(JSON.parse(req.body).courseid) },
        {
          ...course,
          text: JSON.parse(req.body).text,
          name: JSON.parse(req.body).name,
        }
      );
      res.status(200).json({ content: "Done" });
    }
  }
};
