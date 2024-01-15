import React from 'react';

import {Text, StyleSheet, TouchableOpacity} from 'react-native';

type CancelButtonProps = {
  onPress: () => void;
};

function CancelButton({onPress}: CancelButtonProps): React.JSX.Element {
  return (
    <TouchableOpacity onPress={onPress} style={styles.cancelButton}>
      <Text style={styles.cancelButtonText}>✖</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cancelButton: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 100,
    backgroundColor: '#DADADA',
    borderColor: '#767676',
    borderWidth: 4,
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  cancelButtonText: {
    textAlign: 'center',
    fontSize: 40,
    color: '#767676',
  },
});

export default CancelButton;
