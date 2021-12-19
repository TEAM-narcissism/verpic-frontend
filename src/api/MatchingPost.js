import axios from "axios";

function MatchingPost() {
  const onClick = () => {
    axios.post("/api/matching").then((res) => {
      console.log("매칭 생성");
    });
  };

  return (
    <button onClick={onClick} class="border p-2 bg-black text-white ">
      매칭 생성하기{" "}
    </button>
  );
}

export default MatchingPost;
