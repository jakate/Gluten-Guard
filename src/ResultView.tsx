import React from 'react';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';

type ResultViewProps = {
  resetAll: () => void;
  result: string;
};

function ResultView({resetAll, result}: ResultViewProps): React.JSX.Element {
  return (
    <View style={styles.resultView}>
      <View style={styles.resultHolder}>
        <Text style={styles.resultText}>{result}</Text>
      </View>
      <TouchableOpacity onPress={resetAll} style={styles.resetButton}>
        <Text style={styles.resetButtonText}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  resultView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lighter,
    padding: 30,
  },
  resultHolder: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  resultText: {
    textAlign: 'center',
    fontSize: 20,
    lineHeight: 30,
  },
  resetButton: {
    height: 80,
    width: '100%',
    borderRadius: 100,
    backgroundColor: '#DADADA',
    borderColor: '#767676',
    borderWidth: 4,
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginTop: 20,
    alignSelf: 'flex-end',
  },
  resetButtonText: {
    alignSelf: 'center',
    fontSize: 20,
    color: '#333333',
    fontWeight: '900',
  },
});

export default ResultView;
