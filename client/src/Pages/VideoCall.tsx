import { AppBar, Box, ButtonGroup, Fab, Tooltip } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import MeetLogo from "../Components/MeetLogo";
import ChatPage from "../Components/ChatPage";
import { RefObject, useEffect, useRef, useState } from "react";
import { requestAudioVideoPermission } from "../utils/AudioVideoPermission";
import { getMediaTracks } from "../utils/Tracks";
import { createOffer } from "../utils/SDP";

const VideoCall = () => {
  const [showChatBox, setShowChatBox] = useState<boolean>(false);
  const localPeer: RefObject<HTMLVideoElement> = useRef(null);
  const remotePeer: RefObject<HTMLVideoElement> = useRef(null);
  useEffect(() => {
    const requestPermission = async () => {
        try {
            const localStream = await requestAudioVideoPermission();
            const remoteStream = new MediaStream()

            const peerconnection = await createOffer();

            if (localPeer.current) {
              localPeer.current.srcObject = localStream;
            }
            if(remotePeer.current) {
              remotePeer.current.srcObject = remoteStream;
            }

            localStream.getTracks().forEach(async(track) => {
              
              peerconnection.addTrack(track);

            })
            peerconnection.ontrack = (event)=>{
              event.streams[0].getTracks().forEach((track)=>{
                remoteStream.addTrack(track);
              })
            }
            peerconnection.onicecandidate =  async(event) => {
              if(event.candidate){
                console.log(event.candidate);
              }
            }
        } catch (error) {
            console.log('Error requesting permission:', error);
        }
    };
    requestPermission();
    
}, []);

  const handleMessageClickButton = () => {
    setShowChatBox(!showChatBox);
  };

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
            ref={localPeer}
            autoPlay
            className="lg:w-[400px] lg:h-80 xs:w-[300px] xs:h-56"
          ></video>
        </Box>
        <Box>
          <video
            ref={remotePeer}
            autoPlay
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

