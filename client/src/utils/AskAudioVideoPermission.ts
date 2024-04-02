export const requestAudioVideoPermission = async () => {
  const permissions = ["camera", "audio"];
  const constraints = { audio: true, video: true };

  const getPermission = async (permission: PermissionName) => {
    try {
      const status = await window.navigator.permissions.query({
        name: permission,
      });
      return status.state;
    } catch (error) {
      console.log('Permission Not Supported');
      return 'denied'
    }
  };

  const audioPermission = await getPermission(permissions[1] as PermissionName);
  const videoPermission = await getPermission(permissions[0] as PermissionName);

  if (audioPermission === 'denied' || videoPermission === 'denied') {
    await window.navigator.mediaDevices.getUserMedia(constraints);
  }
};
