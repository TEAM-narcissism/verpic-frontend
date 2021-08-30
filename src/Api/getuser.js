import Cookies from "universal-cookie";
import axios from "axios";

function getuser() {
  return new Promise((resolve, reject) => {
    const cookies = new Cookies();
    const token = cookies.get("vtoken");
    axios
      .get("/api/users/current-login-user", {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export default getuser;
