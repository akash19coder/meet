import { RtmChannel, RtmClient } from "agora-rtm-react";
import { RefObject } from "react";

const constraints = { audio: true, video: true };

const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
};

let localStream: MediaStream;
let remoteStream: MediaStream;
let peerconnection: RTCPeerConnection;

export const init = async (
  localPeer: RefObject<HTMLVideoElement>,
  remotePeer: RefObject<HTMLVideoElement>,
  client: RtmClient,
  channel: RtmChannel
) => {
  localStream = await window.navigator.mediaDevices.getUserMedia(constraints);
  console.log("I am local Stream", localStream);
  if (localPeer.current) {
    localPeer.current.srcObject = localStream;
  }
  channel.on("MemberJoined", async (MemberID) => {
    createOffer(remotePeer, MemberID, client);
  });
  client.on("MessageFromPeer", async (message, MemberID) => {
    message = JSON.parse(message.text);
    console.log("I am message", message);
    if (message.type === "offer") {
      createAnswer(MemberID, message, client, peerconnection);
    }
  });
};

const createPeerConnection = async (
  localPeer: RefObject<HTMLVideoElement>,
  remotePeer: RefObject<HTMLVideoElement>,
  MemberID: string,
  client: RtmClient
) => {
  peerconnection = new RTCPeerConnection(servers);

  remoteStream = new MediaStream();

  if (remotePeer.current) {
    remotePeer.current.srcObject = remoteStream;
  }

  if (!localStream) {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    localPeer.current.srcObject = localStream;
    
  }
  localStream.getTracks().forEach((track) => {
    peerconnection.addTrack(track, localStream);
  });

  peerconnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };
  peerconnection.onicecandidate = async (event) => {
    if (event.candidate) {
      await client.sendMessageToPeer(
        { text: JSON.stringify({ type: "candidate", offer: event.candidate }) },
        MemberID
      );
    }
  };
};

const createOffer = async (
  remotePeer: RefObject<HTMLVideoElement>,
  MemberID: string,
  client: RtmClient
) => {
  await createPeerConnection(remotePeer, MemberID, client);

  const offer = await peerconnection.createOffer();
  console.log("i am offer", offer);
  peerconnection.setLocalDescription(offer);
  client.sendMessageToPeer(
    { text: JSON.stringify({ type: "offer", offer: offer }) },
    MemberID
  );
};

const createAnswer = async (
  MemberID: string,
  offer: RTCSessionDescription,
  client: RtmClient,
  peerconnection: RTCPeerConnection
) => {
  await peerconnection.setRemoteDescription(offer.offer);

  const answer = await peerconnection.createAnswer();

  await peerconnection.setLocalDescription(answer);

  await client.sendMessageToPeer(
    { text: JSON.stringify({ type: "offer", offer: answer }) },
    MemberID
  );
};
