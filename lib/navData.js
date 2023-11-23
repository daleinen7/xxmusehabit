export const navData = [
  { url: "/about", text: "About" },
  // { url: "/blog", text: "Blog" },
  { url: "/share", text: "Share", auth: true },
  { function: "handleSignIn", text: "Login", auth: false },
  { function: "handleSignIn", text: "Signup", auth: false },
  { function: "handleLogOut", text: "Logout", auth: true },
];

export default navData;
