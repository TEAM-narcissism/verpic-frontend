import axios from "axios";

function getParticipatedMatches(token) {
    return new Promise((resolve, reject) => {
      axios
      .get("http://localhost:3000/matching/participated-matches", {
            headers: {
                Authorization: token,
            },
        })
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
      });
}

export default getParticipatedMatches;