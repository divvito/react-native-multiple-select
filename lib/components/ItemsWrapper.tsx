import * as React from 'react';
import {ReactNode} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import styles from "../styles";

export interface OwnProps {
  submitButton: ReactNode,
}

export interface ParentProps {
  itemsWrapperStyle?: StyleProp<ViewStyle>,
}

export type Props = OwnProps & ParentProps;

export default class ItemsWrapper extends React.PureComponent<Props> {
  render() {
    const {itemsWrapperStyle, submitButton, children} = this.props;

    return (
      <View style={[styles.itemsWrapper, itemsWrapperStyle]}>
        <View>{children}</View>
        {submitButton}
      </View>
    );
  }
}