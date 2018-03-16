import * as React from 'react';
import { View } from 'react-native';
import styles from "../styles";
export default class SelectedItems extends React.PureComponent {
    render() {
        const { children, selectedItemsStyle } = this.props;
        return (React.createElement(View, { style: [styles.selectedItems, selectedItemsStyle] }, children));
    }
}
