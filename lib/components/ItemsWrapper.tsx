import * as React from 'react';
import {ReactNode} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import styles from "../styles";

export interface OwnProps {
  submitButton: ReactNode,
}

export interface ParentProps {
  itemWrapperStyle?: StyleProp<ViewStyle>,
}

export type Props = OwnProps & ParentProps;

export default class ItemsWrapper extends React.PureComponent<Props> {
  render() {
    const {itemWrapperStyle, submitButton, children} = this.props;

    return (
      <View style={[styles.itemsWrapper, itemWrapperStyle]}>
        <View>{children}</View>
        {submitButton}
      </View>
    );
  }
}