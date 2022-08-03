import { getSession } from "next-auth/react";
import client from "../../lib/mongodbconn";

export default async (req, res) => {
  const session = await getSession({ req });
  if (session) {
    const cl = await client;
    const db = await cl.db();
    const usercol = await db.collection("users");
    const user = await usercol.findOne({ email: session.user.email });
    if (req.body.sector === "bio") {
      try {
        const r = await usercol.replaceOne(
          { email: session.user.email },
          { ...user, bio: req.body.content }
        );
        res.status(200).json({ content: "Done" });
      } catch (error) {
        res.json({ error });
      }
    } else if (req.body.sector === "role") {
      try {
        if (req.body.content == "Student") {
          const r = await usercol.replaceOne(
            { email: session.user.email },
            {
              ...user,
              role: req.body.content,
              status: "Approved",
            }
          );
        } else {
          const rapprovedby = await usercol.aggregate([
            { $match: { role: "Instructor", status: "Approved" } },
            { $sample: { size: 1 } },
          ]);
          const approvedby = await rapprovedby.toArray();
          const r = await usercol.replaceOne(
            { email: session.user.email },
            {
              ...user,
              role: req.body.content,
              status: "Pending Confirmation",
              approvedby: approvedby[0].email,
            }
          );
        }
        res.status(200).json({ content: "Done" });
      } catch (error) {
        res.json({ error });
      }
    }
  }
};
