import MaskedView from '@react-native-masked-view/masked-view';
import React, {LegacyRef} from 'react';

import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CancelButton from './CancelButton';

type AnalyzeViewProps = {
  resetAll: () => void;
  imagePath: string;
  textsFound: string;
};

function AnalyzeView({
  resetAll,
  imagePath,
  textsFound,
}: AnalyzeViewProps): React.JSX.Element {
  const [activeRowIndex, setActiveRowIndex] = React.useState<number>(0);
  const [rows, setRows] = React.useState<string[]>([]);
  const [allRowsDrawn, setAllRowsDrawn] = React.useState<boolean>(false);

  const scrollViewRef = React.useRef<ScrollView>();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      console.log('draw row', activeRowIndex, '/', rows.length);
      if (activeRowIndex < rows.length) {
        setActiveRowIndex(prev => prev + 1);
      } else if (rows.length > 1) {
        setAllRowsDrawn(true);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [activeRowIndex, rows.length]);

  React.useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({animated: true});
    }
  }, [activeRowIndex]);

  // Reset when new text comes in
  React.useEffect(() => {
    setActiveRowIndex(0);
    setRows(textsFound.split('\n'));
    setAllRowsDrawn(false);
  }, [textsFound]);

  return (
    <View style={styles.analyzeView}>
      <ImageBackground
        source={{uri: imagePath}}
        resizeMode="cover"
        style={styles.bgImage}
      />
      <View style={styles.analyzeContents}>
        {!allRowsDrawn && (
          <Text style={styles.analyzeMetaText}>Searching for text</Text>
        )}
        {allRowsDrawn && (
          <>
            <Text style={styles.analyzeMetaText}>Analyzing contents</Text>
            <Text style={styles.analyzeMetaTextSmall}>
              (this might take a while)
            </Text>
          </>
        )}
        <MaskedView
          style={styles.maskedView}
          maskElement={
            <LinearGradient
              style={styles.gradient}
              colors={['transparent', 'white', 'white', 'transparent']}
              locations={[0, 0.1, 0.9, 1]}
              start={{x: 0.5, y: 0}}
              end={{x: 0.5, y: 1}}
            />
          }>
          <ScrollView
            style={styles.analyzeContentsScrollView}
            ref={scrollViewRef as LegacyRef<ScrollView>}>
            <View style={styles.rowWrapper}>
              <Text key="empty-first-row" style={styles.textRow} />
              {rows
                .filter((item, index) => index < activeRowIndex)
                .map(row => (
                  <Text key={row} style={styles.textRow}>
                    {row.trim()}
                  </Text>
                ))}
              <Text key="empty-last-row" style={styles.textRow} />
            </View>
          </ScrollView>
        </MaskedView>
        <CancelButton onPress={resetAll} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  analyzeView: {
    flex: 1,
    width: '100%',
  },
  gradient: {
    flex: 1,
    width: '100%',
  },
  bgImage: {
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  analyzeContents: {
    flex: 1,
    position: 'absolute',
    top: 0,
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 40,
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flexDirection: 'column',
  },
  maskedView: {
    flex: 1,
    marginTop: 40,
    marginBottom: 20,
  },
  analyzeContentsScrollView: {},
  rowWrapper: {
    paddingHorizontal: 20,
  },
  analyzeMetaText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 26,
  },
  analyzeMetaTextSmall: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 16,
  },
  textRow: {
    color: '#cdcdcd',
    textAlign: 'center',
    fontSize: 20,
    paddingVertical: 10,
  },
});

export default AnalyzeView;
