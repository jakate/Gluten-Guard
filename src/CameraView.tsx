import React from 'react';

import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Camera,
  PhotoFile,
  Point,
  useCameraDevice,
} from 'react-native-vision-camera';

type CameraViewProps = {
  camera: React.RefObject<Camera>;
  handleImageCaptured: (image: string) => void;
};

function CameraView({
  camera,
  handleImageCaptured,
}: CameraViewProps): React.JSX.Element {
  const [focusSpot, setFocusSpot] = React.useState<Point | null>();

  const device = useCameraDevice('back', {
    physicalDevices: [
      'ultra-wide-angle-camera',
      'wide-angle-camera',
      'telephoto-camera',
    ],
  });

  const onMediaCaptured = React.useCallback(
    (media: PhotoFile) => {
      console.log(media.path);
      console.log('Media captured!');
      handleImageCaptured(media.path);
    },
    [handleImageCaptured],
  );

  const takePhoto = React.useCallback(async () => {
    try {
      if (camera.current == null) {
        throw new Error('Camera ref is null!');
      }
      console.log('Taking photo...');
      const photo = await camera.current.takePhoto({
        qualityPrioritization: 'speed',
        enableShutterSound: false,
      });

      onMediaCaptured(photo);
    } catch (e) {
      console.error('Failed to take photo!', e);
    }
  }, [camera, onMediaCaptured]);

  const tapToFocus = React.useCallback(
    (event: GestureResponderEvent) => {
      const touch = event.nativeEvent.touches[0];

      if (!device?.supportsFocus) {
        console.log('EI TUE');
        return false;
      }

      const pos = {
        x: touch.locationX,
        y: touch.locationY,
      };
      setFocusSpot(pos);

      camera.current?.focus(pos);

      return true;
    },
    [camera, device?.supportsFocus],
  );

  if (!device) {
    return (
      <View style={styles.deviceIssue}>
        <Text>Starting camera..</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.fillView} onStartShouldSetResponder={tapToFocus}>
        <Camera
          ref={camera}
          photo={true}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          enableDepthData={true}
        />
        {focusSpot && (
          <View
            style={{
              ...styles.focusSpot,
              left: focusSpot.x - 20,
              top: focusSpot.y - 20,
            }}
          />
        )}
      </View>
      <View style={styles.captureButtonCircle}>
        <TouchableOpacity onPress={takePhoto} style={styles.captureButton}>
          <Text style={styles.captureButtonText} />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  captureButtonText: {
    position: 'absolute',
    alignSelf: 'center',
    padding: 30,
    color: '#ffffff',
  },
  captureButtonCircle: {
    width: 30,
    height: 30,
    bottom: 50,
    borderRadius: 100,
    padding: 40,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 2,
    position: 'absolute',
    alignSelf: 'center',
  },
  deviceIssue: {
    flex: 1,
    padding: 50,
    paddingVertical: 150,
  },
  fillView: {flex: 1},
  captureButton: {
    position: 'absolute',
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 100,
    top: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  focusSpot: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
});

export default CameraView;
