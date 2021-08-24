import axios from "axios";

function getRemainTime(token, matchId) {
  return new Promise((resolve, reject) => {
    axios
      .get("http://localhost:3000/time/" + matchId, {
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

export default getRemainTime;
