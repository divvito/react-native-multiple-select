import * as React from 'react';
import { Text, View } from 'react-native';
import styles from "../styles";
export default class NoItems extends React.PureComponent {
    render() {
        const { itemContainerStyle, noItemsTextStyle, noItemsText, fontFamily } = this.props;
        return (React.createElement(View, { style: [styles.itemContainer, itemContainerStyle] },
            React.createElement(Text, { style: [
                    styles.noItemsText,
                    fontFamily ? { fontFamily } : {},
                    noItemsTextStyle
                ] }, noItemsText)));
    }
}
