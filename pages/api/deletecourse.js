import { getSession } from "next-auth/react";
import client from "../../lib/mongodbconn";
import { ObjectId } from "mongodb";

export default async (req, res) => {
  const session = await getSession({ req });
  if (session) {
    const cl = await client;
    const db = await cl.db();
    const ccol = await db.collection("courses");
    const coursesid = req.body.courseid;
    const course = await ccol.findOne({ _id: ObjectId(coursesid) });
    if (course.user_email == session.user.email) {
      await ccol.deleteOne({ _id: ObjectId(coursesid) });
    } else {
      res.writeHead(302, { Location: "/" });
    }
    res.status(200).json({ content: "Done" });
  }
};
