import * as React from 'react';
import { View } from 'react-native';
import styles from "../styles";
export default class ItemsWrapper extends React.PureComponent {
    render() {
        const { itemWrapperStyle, submitButton, children } = this.props;
        return (React.createElement(View, { style: [styles.itemsWrapper, itemWrapperStyle] },
            React.createElement(View, null, children),
            submitButton));
    }
}
