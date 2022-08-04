import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Router from "next/router";

export default function BasicCard({ post, sector }) {
  return (
    <Card
      variant="outlined"
      style={{
        marginTop: 20,
        marginRight: "auto",
        marginLeft: 15,
        width: "90%",
        position: "relative",
      }}
      sx={{ minWidth: 275 }}
    >
      <CardContent>
        <Typography variant="h5" component="div">
          {post.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {post.user_email}
        </Typography>
      </CardContent>

      <CardActions style={{ position: "absolute", top: 30, right: 0 }}>
        <Button
          size="small"
          onClick={() =>
            Router.push(
              (sector == "posts" ? "/art/" : "/course/") + post._id.toString()
            )
          }
        >
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}
