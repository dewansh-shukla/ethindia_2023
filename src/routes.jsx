import { Home, Profile, SignIn, SignUp} from "@/pages";

export const routes = [
  {
    name: "home",
    path: "/home",
    element: <Home />,
  },
  {
    name: "Profile",
    path: "/profile",
    element: <Profile />,
  },
  {
    name: "Users",
    path: "/users",
    element: <SignIn />,
  },
  {
    name: "Insurer",
    path: "/insurer",
    element: <SignUp />,
  },
  {
    name: "Admin",
    path: "/admin",
    element: <SignUp />,
  },
];

export default routes;
