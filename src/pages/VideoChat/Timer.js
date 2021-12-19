import { useEffect, useRef, useState } from "react";

import React from "react";

function Timer() {
  const [min, setMin] = useState(3);
  const [sec, setSec] = useState(0);
  const time = useRef(180);
  const timerId = useRef(null);

  useEffect(() => {
    timerId.current = setInterval(() => {
      setMin(parseInt(time.current / 60));
      setSec(time.current % 60);
      time.current -= 1;
    }, 1000);

    return () => clearInterval(timerId.current);
  }, []);

  useEffect(() => {
    // 만약 타임 아웃이 발생했을 경우
    if (time.current <= 0) {
      console.log("타임 아웃");
      clearInterval(timerId.current);
      // dispatch event
    }
  }, [sec]);

  return (
    <div class="text-2xl border p-2 rounded-lg">
      {min} 분 {sec} 초
    </div>
  );
}

export default React.memo(Timer);
