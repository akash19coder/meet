import { AppBar, Box, ButtonGroup, Fab, Tooltip } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import MeetLogo from "../Components/MeetLogo";
import ChatPage from "../Components/ChatPage";
import { RefObject, useEffect, useRef, useState } from "react";
import { createChannel, createClient,  } from "agora-rtm-react";
import { init } from "../utils/Connection";

const APP_ID = "7a5176d7fc5844c58098e1dedbd20470";
const token = undefined;
const uid = String(Math.ceil(Math.random() * 10000));

const useClient = createClient(APP_ID);
const useChannel = createChannel("meet");

const VideoCall = () => {
  const [showChatBox, setShowChatBox] = useState<boolean>(false);

  const localPeer: RefObject<HTMLVideoElement> = useRef(null);
  const remotePeer: RefObject<HTMLVideoElement> = useRef(null);

  const client = useClient();
  const channel = useChannel(client);

  useEffect(() => {
    const requestPermission = async () => {
      try {
        const loginResult = await client.login({ uid, token });
        console.log("loginResult", loginResult);
        await channel.join();

        init(localPeer, remotePeer, client, channel);
      } catch (error) {
        console.log("Error requesting permission:", error);
      }
    };
    requestPermission();

    // Clean-up function
    return () => {
      // Perform any clean-up here, if necessary
    };
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
            className="lg:w-[400px] lg:h-80 xs:w-[300px] xs:h-56 "
          ></video>
        </Box>
        <Box>
          <video
            ref={remotePeer}
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
