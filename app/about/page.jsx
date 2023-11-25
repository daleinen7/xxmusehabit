import getUserPosts from "../../lib/getUserPosts";

const About = async () => {
  const myPosts = getUserPosts("-Nk3uZtadD-SMopmeGbI");

  // fetch api at /api/test
  const res = await fetch("http://localhost:3000/api/test");
  const data = await res.json();
  console.log("DATA: ", data);

  return (
    <div>
      <h2>About</h2>
      {}
    </div>
  );
};
export default About;
