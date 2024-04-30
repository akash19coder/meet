/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState, useCallback } from "react";
import { AppBar, Box, ButtonGroup, Fab, Tooltip } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ReactPlayer from "react-player";

import { useSocket } from "../context/SocketProvider.jsx";
import MeetLogo from "../Components/MeetLogo.jsx";
import ChatPage from "../Components/ChatPage.jsx";
import peer from "../service/PeerConnection.js";

const VideoCall = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  return (
    <div className="w-full h-[100vh] bg-gray-200">
      <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
      {myStream && <button onClick={sendStreams}>Send Stream</button>}
      {remoteSocketId && <button onClick={handleCallUser}>CALL</button>}
      <Box>
        <AppBar className="bg-black h-auto flex justify-center items-center flex-row static">
          <MeetLogo></MeetLogo>
        </AppBar>
      </Box>

      <Box className="h-[60vh] flex justify-center gap-3 items-center xs:flex-col sm:flex-col md:flex-col lg:flex-row xl:flex-row 2xl:flex-row mt-10">
        <Box>
        <ReactPlayer
            playing
            muted
            height="300px"
            width="300px"
            url={myStream}
          />
        </Box>
        <Box>
        <ReactPlayer
            playing
            muted
            height="300px"
            width="300px"
            url={remoteStream}
          />
        </Box>
        
      </Box>

      <Box className="flex justify-center items-center flex-row mt-7">
        <ButtonGroup size="large" className="text-gray-950">
          <Tooltip title="Start">
            <Fab className="border-gray-950 m-2">
              <PlayCircleOutlineIcon className=" text-gray-950 size-9" />
            </Fab>
          </Tooltip>
          <Tooltip title="Next">
            <Fab className="border-gray-950 m-2">
              <SkipNextIcon className=" text-gray-950 size-9" />
            </Fab>
          </Tooltip>
          <Tooltip title="Stop">
            <Fab className="border-gray-950 m-2">
              <StopCircleIcon className=" text-gray-950 size-9" />
            </Fab>
          </Tooltip>
          {window.innerWidth > 768 && (
            <Tooltip title="Send Message">
              <Fab
                className="border-gray-950 m-2 bg-blue-200"
                onClick={handleMessageClickButton}
              >
                <ChatBubbleOutlineIcon className=" text-gray-950 size-7" />
              </Fab>
            </Tooltip>
          )}
        </ButtonGroup>
      </Box>
    </div>
  );
};

export default VideoCall;
