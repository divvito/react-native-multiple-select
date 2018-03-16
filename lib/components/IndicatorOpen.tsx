import * as React from 'react';
import {StyleProp, TextStyle, TouchableOpacity} from 'react-native';
import styles from "../styles";
import {Icon} from "react-native-vector-icons/Icon";

export interface OwnProps {
  onPress: () => void,
}

export interface ParentProps {
  indicatorOpenStyle?: StyleProp<TextStyle>,
  indicatorStyle?: StyleProp<TextStyle>,
}

export type Props = OwnProps & ParentProps;

export default class IndicatorOpen extends React.PureComponent<Props> {
  render() {
    const {indicatorStyle, indicatorOpenStyle, onPress} = this.props;

    return (
      <TouchableOpacity onPress={onPress}>
        <Icon
          name="menu-down"
          style={[
            styles.indicator,
            styles.indicatorOpen,
            indicatorStyle,
            indicatorOpenStyle,
          ]}
        />
      </TouchableOpacity>
    );
  }
}