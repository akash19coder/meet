import { RtmClient } from "agora-rtm-react";

const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
};

export const createOffer = async (MemberID:string, client:RtmClient) => {
  const peerconnection = new RTCPeerConnection();
  console.log('I am peer candidate',peerconnection.onicecandidate); //outputs 'null' on the console
  try {
    peerconnection.onicecandidate = async (event) => {
      console.log('I have entered the candidate');
      if (event.candidate) {
        await client.sendMessageToPeer({text: JSON.stringify({'type':'candidate','offer':event.candidate})},MemberID);
      }
    };
  } catch (error) {
    console.log('I am candidate error', error)
  }
  const offer = await peerconnection.createOffer();
  console.log('I am offer', offer);

  await peerconnection.setLocalDescription(offer);

  await client.sendMessageToPeer({text: JSON.stringify({'type':'offer','offer':offer})},MemberID);
  return peerconnection;
};

