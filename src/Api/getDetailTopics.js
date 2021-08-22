import axios from "axios";

function getDetailTopics(token, matchId) {
    console.log(matchId)
  return new Promise((resolve, reject) => {
    axios
      .get("http://localhost:3000/detail_topics_match_id/" + matchId, {
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

export default getDetailTopics;
