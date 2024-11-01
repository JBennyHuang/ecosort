import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface CameraButtonProps {
  onPress: () => void;
  iconSize?: number;
  iconColor?: string;
}

const CameraButton: React.FC<CameraButtonProps> = ({ onPress, iconSize = 24, iconColor = '#000' }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <FontAwesome name="camera" size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CameraButton;