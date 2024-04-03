export const requestAudioVideoPermission = async () => {
  const constraints = { audio: true, video: true };
  const stream = await window.navigator.mediaDevices.getUserMedia(constraints);
  return stream;
};
