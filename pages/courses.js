import client from "../lib/mongodbconn";
import Post from "../components/Post";

export default function Home({ courses }) {
  return (
    <div>
      {courses.length ? (
        courses.map((course) => (
          <Post key={course.id} post={course} sector="courses" />
        ))
      ) : (
        <div className="mx-auto" style={{ width: "max-content" }}>
          no courses is here yet
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const cl = await client;
  const db = await cl.db();
  const col = await db.collection("courses");
  const rcourses = await col.find({});
  const courses = await rcourses.toArray();
  for (let i = 0; i < courses.length; i++) {
    courses[i]._id = courses[i]._id.toString();
  }
  return {
    props: { courses },
  };
}
