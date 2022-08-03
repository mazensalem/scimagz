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
    const postcol = await db.collection("posts");
    const postid = req.body.postid;
    const post = await postcol.findOne({ _id: ObjectId(postid) });
    if (post.user_email == session.user.email) {
      const r = await cloudinary.uploader.destroy(post.file.public_id, {
        resource_type: "raw",
      });
      await postcol.deleteOne({ _id: ObjectId(postid) });
    } else {
      res.writeHead(302, { Location: "/" });
    }
    res.status(200).json({ content: "Done" });
  }
};
