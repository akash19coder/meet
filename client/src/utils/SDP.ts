const configuration: RTCConfiguration = {
  iceServers: [
    {
      urls: ["stun1.l.google.com:19302", "stun2.l.google.com:19302"],
    },
  ],
};
export const createOffer = async () => {
  const peerconnection = new RTCPeerConnection(configuration);
  const offer = await peerconnection.createOffer();
  peerconnection.setLocalDescription(offer);
  console.log("offer", offer);
};
