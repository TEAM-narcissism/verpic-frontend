import axios from "axios";
import Cookies from 'universal-cookie';
function getuser(token) {
  return new Promise((resolve, reject) => {
    const cookies = new Cookies();
    const token = cookies.get('vtoken');
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
