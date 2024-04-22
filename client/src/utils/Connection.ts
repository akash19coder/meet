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
  if (localPeer.current) {
    localPeer.current.srcObject = localStream;
  }
  channel.on("MemberJoined", async (MemberID) => {
    console.log('a member has joined with memeber id:', MemberID);
    await createOffer(localPeer,remotePeer, MemberID, client);
  });

  client.on("MessageFromPeer", async (message, MemberID) => {
    message = JSON.parse(message.text);
    if (message.type === "offer") {
      await createAnswer(localPeer, remotePeer, MemberID, message, client, peerconnection);
    }
    if(message.type === "answer"){
      if(!peerconnection.currentRemoteDescription){
        peerconnection.setRemoteDescription(message.answer);
      }
    }
    if(message.type === "candidate"){
      if(peerconnection){
        peerconnection.addIceCandidate(message.candidate);
      }
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
    console.log('i am adding remoteStream');
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
    console.log('i have added tracks')
  });

  peerconnection.ontrack = (event) => {
    
    event.streams[0].getTracks().forEach((track) => {
      const videoStream = new MediaStream()
      videoStream.addTrack(track)
      videoStream.addTrack(track);
      remotePeer.current.srcObject = videoStream
      
      console.log('i have received tracks', track);
    });
    if (remotePeer.current) {
      console.log('i am adding remoteStream and i am inside tracks');
      remotePeer.current.srcObject = remoteStream;
      console.log(remotePeer.current.srcObject);
    }
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
  localPeer: RefObject<HTMLVideoElement>,
  remotePeer: RefObject<HTMLVideoElement>,
  MemberID: string,
  client: RtmClient
) => {
  await createPeerConnection(localPeer,remotePeer, MemberID, client);

  const offer = await peerconnection.createOffer();
  peerconnection.setLocalDescription(offer);
  client.sendMessageToPeer(
    { text: JSON.stringify({ type: "offer", offer: offer }) },
    MemberID
  );
};

const createAnswer = async (
  localPeer: RefObject<HTMLVideoElement>,
  remotePeer: RefObject<HTMLVideoElement>,
  MemberID: string,
  offer: RTCSessionDescription,
  client: RtmClient,
  peerconnection: RTCPeerConnection
) => {
  await createPeerConnection(localPeer,remotePeer, MemberID, client);

  await peerconnection.setRemoteDescription(offer.offer);
  console.log('after setting remoteRemoteDescription', peerconnection);
  const answer = await peerconnection.createAnswer();
  console.log('i am answer', answer);
  await peerconnection.setLocalDescription(answer);

  await client.sendMessageToPeer(
    { text: JSON.stringify({ type: "offer", offer: answer }) },
    MemberID
  );
};
