import { MediaRecorder, register } from "extendable-media-recorder";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

import Cookies from "universal-cookie";
import axios from "axios";
import { connect } from "extendable-media-recorder-wav-encoder";
import styled from "@emotion/styled";
import tw from "twin.macro";

const ButtonStyle = styled.button`
  ${tw`bg-blue-500 text-white m-2 rounded-xl w-24 h-12`}
`;

const AudioRecord = forwardRef(({ matchId }, ref) => {
  const [stream, setStream] = useState();
  const [media, setMedia] = useState();
  const [onRec, setOnRec] = useState(true);
  const [source, setSource] = useState();
  const [analyser, setAnalyser] = useState();
  const [data, setData] = useState({
    audioUrl: "",
    lang: "",
    order: 0,
  });
  const cookies = new Cookies();

  useImperativeHandle(ref, () => ({
    micButtonOff,
    onRecAudio,
    offRecAudio,
    onSubmitAudioFile,
  }));
  const test = () => {
    if (media) {
      console.log("녹음 상태: ", media.state);
      if (media.state === "recording") {
        media.pause();
      } else if (media.state === "paused") {
        media.resume();
      }
    } else {
      console.log("녹음중이지 않습니다.");
    }
  };
  const onRecAudio = (audioState = true) => {
    // 음원정보를 담은 노드를 생성하거나 음원을 실행또는 디코딩 시키는 일을 한다
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    //audioCtx.resume();
    // 자바스크립트를 통해 음원의 진행상태에 직접접근에 사용된다.
    const analyser = audioCtx.createScriptProcessor(0, 1, 1);
    setAnalyser(analyser);

    function makeSound(stream) {
      // 내 컴퓨터의 마이크나 다른 소스를 통해 발생한 오디오 스트림의 정보를 보여준다.
      const source = audioCtx.createMediaStreamSource(stream);
      setSource(source);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
    }
    // 마이크 사용 권한 획득

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(async (stream) => {
        stream.getAudioTracks().forEach(function (track) {
          track.enabled = audioState;
        });

        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: "audio/wav",
        });
        mediaRecorder.start();
        setStream(stream);
        setMedia(mediaRecorder);
        makeSound(stream);

        analyser.onaudioprocess = function (e) {
          // 7분 10초(430초) 지나면 자동으로 음성 저장 및 녹음 중지
          if (e.playbackTime > 430) {
            stream.getAudioTracks().forEach(function (track) {
              track.stop();
            });
            mediaRecorder.stop();
            // 메서드가 호출 된 노드 연결 해제
            analyser.disconnect();
            audioCtx.createMediaStreamSource(stream).disconnect();

            mediaRecorder.ondataavailable = function (e) {
              setData({
                //...data,
                audioUrl: e.data,
              });
              setOnRec(true);
            };
          } else {
            setOnRec(false);
          }
        };
      });
  };

  // 음성 녹음 중지
  const offRecAudio = (order, lang) => {
    // dataavailable 이벤트로 Blob 데이터에 대한 응답을 받을 수 있음
    media.ondataavailable = function (e) {
      //setAudioUrl(e.data);
      setData({
        //...data,
        audioUrl: e.data,
        order: order,
        lang: lang,
      });
      setOnRec(true);
    };

    // 모든 트랙에서 stop()을 호출해 오디오 스트림을 정지
    stream.getAudioTracks().forEach(function (track) {
      //track.enabled = false;
      track.stop();
    });

    // 미디어 캡처 중지
    media.stop();
    // 메서드가 호출 된 노드 연결 해제
    analyser.disconnect();
    source.disconnect();
  };

  const micButtonOff = () => {
    if (stream) {
      stream.getAudioTracks().forEach(function (track) {
        track.enabled = !track.enabled;
      });
    }
  };

  const onSubmitAudioFile = () => {
    console.log(new Date());
    if (data.audioUrl) {
      console.log(data);
      console.log(URL.createObjectURL(data.audioUrl)); // 출력된 링크에서 녹음된 오디오 확인 가능
      const sound = new File([data.audioUrl], "soundBlob", {
        lastModified: new Date().getTime(),
        type: "audio/wav",
      });
      const token = cookies.get("vtoken");
      const formData = new FormData();
      formData.append("file", sound);
      formData.append("lang", data.lang);
      formData.append("order", data.order);
      formData.append("matchId", matchId);
      console.log(formData);
      axios.post("/api/analysis/save", formData, {
        headers: {
          Authorization: token,
        },
      });
      console.log(sound); // File 정보 출력
    }
    // File 생성자를 사용해 파일로 변환
  };

  useEffect(() => {
    (async function () {
      await register(await connect());
    })();
    console.log("매치아이디", matchId);
  }, []);

  useEffect(() => {
    onSubmitAudioFile();
  }, [data]);

  return (
    <>
      {/* <ButtonStyle onClick={onRec ? onRecAudio : offRecAudio}>녹음</ButtonStyle>
      <ButtonStyle onClick={onSubmitAudioFile}>결과 확인</ButtonStyle> */}
    </>
  );
});

export default AudioRecord;
