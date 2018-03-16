import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import styles from "../styles";
import { Icon } from "react-native-vector-icons/Icon";
export default class IndicatorOpen extends React.PureComponent {
    render() {
        const { indicatorStyle, indicatorOpenStyle, onPress } = this.props;
        return (React.createElement(TouchableOpacity, { onPress: onPress },
            React.createElement(Icon, { name: "menu-down", style: [
                    styles.indicator,
                    styles.indicatorOpen,
                    indicatorStyle,
                    indicatorOpenStyle,
                ] })));
    }
}
