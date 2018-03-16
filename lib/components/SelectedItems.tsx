import * as React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import styles from "../styles";

export interface Props {
  selectedItemsStyle?: StyleProp<ViewStyle>
}

export default class SelectedItems extends React.PureComponent<Props> {
  render() {
    const {children, selectedItemsStyle} = this.props;

    return (
      <View style={[styles.selectedItems, selectedItemsStyle]}>
        {children}
      </View>
    );
  }
}