import Cookies from "universal-cookie";
import axios from "axios";

function isAuthorized() {
  const cookies = new Cookies();
  const token = cookies.get("vtoken");

  if (!token) {
    console.log("토큰 없어");
    return false;
  } else {
    return true;
  }
}

export default isAuthorized;
