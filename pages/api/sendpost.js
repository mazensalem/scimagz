import { getSession } from "next-auth/react";
import client from "../../lib/mongodbconn";
import { ObjectId } from "mongodb";

const cloudinary = require("cloudinary").v2;
cloudinary.config({ long_url_signature: process.env.CLOUDINARY_URL });

export default async (req, res) => {
  const session = await getSession({ req });
  if (session) {
    const cl = await client;
    const db = await cl.db();
    const usercol = await db.collection("users");
    const postcol = await db.collection("posts");
    const rapprovedby = await usercol.aggregate([
      { $match: { role: "Instructor", status: "Approved" } },
      { $sample: { size: 1 } },
    ]);
    const approvedby = await rapprovedby.toArray();
    if (JSON.parse(req.body).sector == "Image") {
      if (JSON.parse(req.body).postid == null) {
        const r = await postcol.insertOne({
          file: {
            url: JSON.parse(req.body).url,
            public_id: JSON.parse(req.body).public_id,
          },
          status: "Pending confirmation",
          user_email: session.user.email,
          approvedby: approvedby[0].email,
        });
      } else {
        const post = await postcol.findOne({
          _id: ObjectId(JSON.parse(req.body).postid),
        });
        if (post.file) {
          const r = await cloudinary.uploader.destroy(post.file.public_id, {
            resource_type: "raw",
          });
        }
        await postcol.replaceOne(
          { _id: ObjectId(JSON.parse(req.body).postid) },
          {
            ...post,
            file: {
              url: JSON.parse(req.body).url,
              public_id: JSON.parse(req.body).public_id,
            },
            status: "Pending confirmation",
          }
        );
      }
    } else if (JSON.parse(req.body).sector == "text") {
      if (JSON.parse(req.body).postid == null) {
        const r = await postcol.insertOne({
          text: JSON.parse(req.body).text,
          name: JSON.parse(req.body).name,
          status: "Pending confirmation",
          user_email: session.user.email,
          approvedby: approvedby[0].email,
        });
        res.json({ content: r.insertedId.toString() });
      } else {
        const post = await postcol.findOne({
          _id: ObjectId(JSON.parse(req.body).postid),
        });
        await postcol.replaceOne(
          { _id: ObjectId(JSON.parse(req.body).postid) },
          {
            ...post,
            text: JSON.parse(req.body).text,
            name: JSON.parse(req.body).name,
            status: "Pending confirmation",
          }
        );
      }
    }
    res.status(200).json({ content: "Done" });
  }
};
