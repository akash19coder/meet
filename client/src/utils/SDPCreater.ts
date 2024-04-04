import { createInstance } from "../assets/SignallingSDK/libs/agora-rtm-sdk";

const APP_ID = "7a5176d7fc5844c58098e1dedbd20470";
const token = null;
const uid = String(Math.ceil(Math.random() * 10000));

const configuration: RTCConfiguration = {
  iceServers: [
    {
      urls: ["stun1.l.google.com:19302", "stun2.l.google.com:19302"],
    },
  ],
};


const client =  createInstance(APP_ID);

await client.login({uid});

const channel = await client.createChannel("meet");
await channel.join();

channel.on("MemberJoined", (MemberID) => {
  console.log(MemberID);
});

export const createOffer = async () => {
  const peerconnection = new RTCPeerConnection();
  const offer = await peerconnection.createOffer();
  console.log(offer.sdp);
  peerconnection.setLocalDescription(offer);
  return peerconnection;
};
