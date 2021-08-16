import axios from "axios";

function getuser(token) {
  return new Promise((resolve, reject) => {
    axios
      .get("users/current-login-user", {
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
