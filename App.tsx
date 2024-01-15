/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import SoundPlayer from 'react-native-sound-player';

import {Button, Linking, StyleSheet, View} from 'react-native';
import {Camera, CameraPermissionStatus} from 'react-native-vision-camera';
import {orderBy} from 'lodash';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import ResultView from './src/ResultView';
import CapturedImageView from './src/CapturedImageView';
import CameraView from './src/CameraView';
import AnalyzeView from './src/AnalyzeView';

import {UPLOAD_URL, MESSAGES_URL} from '@env';

type AiMessage = {
  id: string;
  createdAt: number;
  threadId: string;
  audio: string;
  text: string;
};

function App(): React.JSX.Element {
  const camera = React.useRef<Camera>(null);

  const [imagePath, setImagePath] = React.useState<string | null>();
  const [isAnalyzing, setIsAnalyzing] = React.useState<boolean>(false);
  const [result, setResult] = React.useState<string | null>(null);

  const [threadId, setThreadId] = React.useState<string | null>();

  const [textsFound, setTextsFound] = React.useState<string>('');
  const [aiMessages, setAiMessages] = React.useState<Array<AiMessage>>([]);
  const [processedIds, setProcessedIds] = React.useState<string[]>([]);

  const [cameraPermission, setCameraPermission] =
    React.useState<CameraPermissionStatus>();

  const handleImageCaptured = React.useCallback((image: string) => {
    console.log('New image taken!');
    setImagePath(image);
    setIsAnalyzing(false);
    setThreadId(null);
    setResult(null);
    setAiMessages([]);
    setProcessedIds([]);
  }, []);

  const askForCameraPermission = React.useCallback(async () => {
    console.log('REQ');

    console.log('Requesting camera permission...');
    const permission = await Camera.requestCameraPermission();
    console.log(`Camera permission status: ${permission}`);

    if (permission === 'denied') {
      await Linking.openSettings();
    }
    setCameraPermission(permission);
  }, []);

  React.useEffect(() => {
    Camera.getCameraPermissionStatus().then(setCameraPermission);
  }, []);

  const createFormData = React.useCallback(() => {
    const data = new FormData();

    data.append('file', {
      name: 'image',
      type: 'image/jpg',
      uri: imagePath,
    });

    return data;
  }, [imagePath]);

  const activeAiMessage: AiMessage | null = aiMessages[0] || null;

  React.useEffect(() => {
    const onFinishedPlaying = SoundPlayer.addEventListener(
      'FinishedPlaying',
      () => {
        console.log('FinishedPlaying');
        setAiMessages(prev => prev.slice(1));
      },
    );
    const onFinishedLoading = SoundPlayer.addEventListener(
      'FinishedLoading',
      () => {
        console.log('FinishedLoading');
      },
    );
    const onFinishedLoadingFile = SoundPlayer.addEventListener(
      'FinishedLoadingFile',
      () => {
        console.log('FinishedLoadingFile');
      },
    );
    const onFinishedLoadingURL = SoundPlayer.addEventListener(
      'FinishedLoadingURL',
      () => {
        console.log('FinishedLoadingURL');
      },
    );

    return () => {
      onFinishedPlaying.remove();
      onFinishedLoading.remove();
      onFinishedLoadingFile.remove();
      onFinishedLoadingURL.remove();
    };
  }, []);

  const checkNewMessages = React.useCallback(() => {
    console.log('fetch data for thread', threadId);
    if (!threadId) {
      console.log("Don't fetch, no threadId");
      return;
    }

    fetch(`${MESSAGES_URL}/${threadId}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(response => {
        console.log('response');
        console.log(JSON.stringify(response));
        console.log('-----------------------------');
        const messages = response.messages
          .map(
            (message: any): AiMessage => ({
              id: message.id,
              createdAt: message.created_at,
              threadId: message.thread_id,
              audio: message.audio,
              text: message?.content?.[0].text.value,
            }),
          )
          .filter(({id}: AiMessage) => !processedIds.includes(id));
        const messageList = orderBy(messages, ({createdAt}) => createdAt);
        setAiMessages(messageList);
      })
      .catch(error => {
        console.log('error', error);
      });
  }, [processedIds, threadId]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (isAnalyzing) {
        console.log('poll messages...');
        checkNewMessages();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [checkNewMessages, isAnalyzing]);

  const playSound = React.useCallback((url: string) => {
    console.log('PLAY SOUND', url);
    SoundPlayer.playUrl(url);
  }, []);

  React.useEffect(() => {
    console.log('activeAiMessage changed');
    if (!activeAiMessage) {
      return;
    }

    setProcessedIds(prev => [...prev, activeAiMessage.id]);
    setResult(activeAiMessage.text);
    playSound(activeAiMessage.audio);
  }, [activeAiMessage, playSound]);

  const analyzeImage = React.useCallback(() => {
    console.log('Send image for analysis');
    setIsAnalyzing(true);

    const url = `${UPLOAD_URL}`;
    console.log('url', url);

    fetch(url, {
      method: 'POST',
      body: createFormData(),
    })
      .then(response => {
        console.log(response);

        return response.json();
      })
      .then(response => {
        console.log('response', response);

        if (response.textsFound) {
          setTextsFound(response.textsFound);
        }

        if (response.threadId) {
          console.log('Will start polling with thread id:', response.threadId);
          setThreadId(response.threadId);
          checkNewMessages();
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  }, [checkNewMessages, createFormData]);

  const resetAll = React.useCallback(() => {
    setThreadId(null);
    setIsAnalyzing(false);
    setImagePath(null);
    setResult(null);
    setAiMessages([]);
    setProcessedIds([]);
  }, []);

  if (result) {
    return <ResultView resetAll={resetAll} result={result} />;
  }

  if (imagePath && isAnalyzing) {
    console.log('imagePath');
    console.log(imagePath);
    return (
      <AnalyzeView
        textsFound={textsFound}
        imagePath={imagePath}
        resetAll={resetAll}
      />
    );
  }

  if (imagePath) {
    return (
      <CapturedImageView
        imagePath={imagePath}
        analyzeImage={analyzeImage}
        resetAll={resetAll}
      />
    );
  }

  if (cameraPermission) {
    return (
      <CameraView camera={camera} handleImageCaptured={handleImageCaptured} />
    );
  }

  return (
    <View style={styles.permissionView}>
      <Button onPress={askForCameraPermission} title="Give permission" />
    </View>
  );
}

const styles = StyleSheet.create({
  permissionView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lighter,
    paddingTop: 230,
    padding: 30,
  },
});

export default App;
