import React from 'react';

import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CancelButton from './CancelButton';

type CapturedImageViewProps = {
  resetAll: () => void;
  analyzeImage: () => void;
  imagePath: string;
};

function CapturedImageView({
  analyzeImage,
  resetAll,
  imagePath,
}: CapturedImageViewProps): React.JSX.Element {
  return (
    <>
      <ImageBackground
        source={{uri: imagePath}}
        resizeMode="cover"
        style={styles.bgImage}
      />
      <View style={styles.pageContent}>
        <View style={styles.options}>
          <TouchableOpacity onPress={analyzeImage} style={styles.analyzeButton}>
            <Text style={styles.analyzeButtonText}>Analyze</Text>
          </TouchableOpacity>

          <CancelButton onPress={resetAll} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  pageContent: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: 40,
  },
  options: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  analyzeButton: {
    height: 80,
    flex: 1,
    borderRadius: 100,
    backgroundColor: '#DADADA',
    borderColor: '#767676',
    borderWidth: 4,
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginRight: 20,
  },
  analyzeButtonText: {
    alignSelf: 'center',
    fontSize: 20,
    color: '#333333',
    fontWeight: '900',
  },
});

export default CapturedImageView;
