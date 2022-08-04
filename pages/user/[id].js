import { ObjectId } from "mongodb";
import React from "react";
import client from "../../lib/mongodbconn";
import TextReader from "../../components/Textreader";
import {
  Avatar,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";

export default function User({ user }) {
  return (
    <Grid
      container
      style={{
        marginTop: 10,
      }}
      rowSpacing={4}
    >
      <Grid xs={12} md={3} item>
        <Card
          style={{
            marginTop: 40,
            marginRight: "auto",
            width: "90%",
            textAlign: "center",
            overflow: "visible",
          }}
          sx={{ minWidth: 275 }}
          elevation={0}
        >
          <CardContent style={{ position: "relative", paddingTop: 50 }}>
            <Avatar
              src={user.image}
              sx={{ width: 80, height: 80 }}
              style={{
                position: "absolute",
                right: "50%",
                top: 0,
                transform: "translate(50%, -50%)",
              }}
            />
            <Typography variant="h5" component="div">
              {user.name}
            </Typography>
            <Typography component="div">{user.email}</Typography>
            <Typography component="div">
              {user.status} {user.role}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item md={3} xs={0}></Grid>

      <Grid item xs={12} md={6}>
        <Card
          style={{
            marginTop: 20,
            marginRight: "auto",
            width: "90%",
            textAlign: "center",
            overflow: "visible",
          }}
          sx={{ minWidth: 275 }}
          elevation={0}
        >
          <CardContent style={{ position: "relative", paddingTop: 50 }}>
            <h3>About me</h3>
            <Typography component="div">
              <TextReader content={JSON.parse(user.bio)} />
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export async function getServerSideProps(context) {
  const id = context.query.id;
  const cl = await client;
  const db = await cl.db();
  const ucol = await db.collection("users");
  const user = await ucol.findOne({ _id: ObjectId(id) });
  if (!user) {
    context.res.writeHead(302, {
      Location: "/",
      "Cache-Control": "max-age=0",
    });
  }
  user._id = null;
  return { props: { user } };
}
