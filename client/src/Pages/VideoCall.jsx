import { useState } from "react";
import { AppBar, Box, ButtonGroup, Fab, Tooltip } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import {useParams} from 'react-router-dom'
import { io } from "socket.io-client"

import MeetLogo from "../Components/MeetLogo.jsx";
import ChatPage from "../Components/ChatPage.jsx";



const VideoCall = () => {
  const [showChatBox, setShowChatBox] = useState(false);
  const roomId = useParams()
  const handleMessageClickButton = () => {
    setShowChatBox(!showChatBox);
  };
  const socket = io("localhost:3000");
  const myUniqueNum = Math.random();

  socket.emit("room:joined", {roomId, myUniqueNum});
  socket.on("new:joinee", (data)=> {
    console.log(data);
  })
  return (
    <div className="w-full h-[100vh] bg-gray-200">
      <Box>
        <AppBar className="bg-black h-auto flex justify-center items-center flex-row static">
          <MeetLogo></MeetLogo>
        </AppBar>
      </Box>

      <Box className="h-[60vh] flex justify-center gap-3 items-center xs:flex-col sm:flex-col md:flex-col lg:flex-row xl:flex-row 2xl:flex-row mt-10">
        <Box>
          <video
            autoPlay
            className="lg:w-[400px] lg:h-80 xs:w-[300px] xs:h-56"
          ></video>
        </Box>
        <Box>
          <video
            autoPlay
            controls
            className="lg:w-[400px] lg:h-80 xs:w-[300px] xs:h-56"
          ></video>
        </Box>
        {showChatBox && <ChatPage></ChatPage>}
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
