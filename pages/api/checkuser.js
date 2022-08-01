import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";

export default async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session) {
    res.send({
      content: "true",
    });
  } else {
    res.redirect("/api/auth/signin?callbackUrl=" + req.query.url);
  }
};
