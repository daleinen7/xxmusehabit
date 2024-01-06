export const navData = [
  { url: '/about', text: 'About' },
  // { url: "/blog", text: "Blog" },
  { url: '/share', text: 'Share', auth: true, share: true },
  { url: 'login', text: 'Login', auth: false },
  { url: 'signup', text: 'Signup', auth: false },
  { function: 'handleLogOut', text: 'Logout', auth: true },
];

export default navData;
