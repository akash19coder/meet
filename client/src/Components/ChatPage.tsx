import { Box, Button, Stack, TextField } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
const ChatPage = () => {
  return (
    <>
      <Box className="w-[30vw] h-[60vh] border-gray-500 relative flex flex-row justify-center items-center bg-gray-300 rounded-lg p-5 anima">
        <Stack className="flex flex-row justify-center items-center absolute bottom-3 w-full p-4">
          <TextField className="w-full" multiline placeholder="Send a message"></TextField>
          <Button endIcon={<SendIcon/>} className="text-gray-500">
            
          </Button>
        </Stack>
      </Box>
    </>
  );
};

export default ChatPage;
