import axios from "axios";

function getFeedbackScript(token, matchId) {
  console.log(matchId)
    return new Promise((resolve, reject) => {
      axios
      .post("http://localhost:3000/analysis/getscript/" + matchId, {}, {
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

export default getFeedbackScript;