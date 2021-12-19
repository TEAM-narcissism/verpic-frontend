import { UserContext } from "../Home/MainPage";
import { useContext } from "react";

function TestingComponent() {
  const [user, setUser] = useContext(UserContext);

  console.log(user);

  return <>{/* <div>{user.id}</div> */}</>;
}

export default TestingComponent;
