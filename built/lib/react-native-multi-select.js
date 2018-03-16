import * as React from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { find, get, reject } from 'lodash';
import * as escapeStringRegexp from 'escape-string-regexp';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles, { colorPack } from './styles';
export default class MultiSelect extends React.PureComponent {
    constructor(props) {
        super(props);
        this.getSelectedItemsExt = (optionalSelectedItems) => (React.createElement(View, { style: styles.selectedItemsExt }, this._displaySelectedItems(optionalSelectedItems)));
        this._onChangeInput = (value) => {
            const { onChangeInput } = this.props;
            if (onChangeInput) {
                onChangeInput(value);
            }
            this.setState({ searchTerm: value });
        };
        this._getSelectLabel = () => {
            const { selectText, single, selectedItems, displayKey, getSelectLabel } = this.props;
            if (getSelectLabel) {
                return getSelectLabel({ selectText, single, selectedItems, displayKey });
            }
            else if (!selectedItems || selectedItems.length === 0) {
                return selectText;
            }
            else if (single) {
                const item = selectedItems[0];
                const foundItem = this._findItem(item);
                return get(foundItem, displayKey) || selectText;
            }
            return `${selectText} (${selectedItems.length} selected)`;
        };
        this._findItem = (itemKey) => {
            const { items, uniqueKey } = this.props;
            return find(items, (singleItem) => singleItem[uniqueKey] === itemKey);
        };
        this._displaySelectedItems = (optionalSelectedItems) => {
            const { fontFamily, tagRemoveIconColor, tagBorderColor, uniqueKey, tagTextColor, selectedItems, displayKey, } = this.props;
            const actualSelectedItems = optionalSelectedItems || selectedItems;
            return actualSelectedItems.map((singleSelectedItem) => {
                const item = this._findItem(singleSelectedItem);
                if (!item) {
                    return null;
                }
                if (!item[displayKey]) {
                    return null;
                }
                const display = item[displayKey];
                const unique = item[uniqueKey];
                return (React.createElement(View, { style: [
                        styles.selectedItem,
                        styles.selectedItemExt,
                        {
                            width: ((display).length * 8) + 60,
                            borderColor: tagBorderColor,
                        },
                    ], key: unique },
                    React.createElement(Text, { style: [
                            styles.selectedItemExtText,
                            Object.assign({ color: tagTextColor }, (fontFamily ? { fontFamily } : {})),
                        ], numberOfLines: 1 }, display),
                    React.createElement(TouchableOpacity, { onPress: () => {
                            this._removeItem(item);
                        } },
                        React.createElement(Icon, { name: "cancel", style: [
                                styles.selectedItemExtIcon,
                                {
                                    color: tagRemoveIconColor,
                                }
                            ] }))));
            });
        };
        this._removeItem = (item) => {
            const { uniqueKey, selectedItems, onSelectedItemsChange } = this.props;
            if (onSelectedItemsChange) {
                const newItems = reject(selectedItems, (singleItem) => item[uniqueKey] === singleItem);
                // broadcast new selected items state to parent component
                onSelectedItemsChange(newItems);
            }
        };
        this._removeAllItems = () => {
            const { onSelectedItemsChange } = this.props;
            if (onSelectedItemsChange) {
                // broadcast new selected items state to parent component
                onSelectedItemsChange([]);
            }
        };
        this._toggleSelector = () => {
            this.setState({
                selector: !this.state.selector,
            });
        };
        this._clearSearchTerm = () => {
            this.setState({
                searchTerm: '',
            });
        };
        this._submitSelection = () => {
            this._toggleSelector();
            // reset searchTerm
            this._clearSearchTerm();
        };
        this._itemSelected = (item) => {
            const { uniqueKey, selectedItems } = this.props;
            return selectedItems.indexOf(item[uniqueKey]) !== -1;
        };
        this._addItem = () => {
            const { uniqueKey, displayKey, items, selectedItems, onSelectedItemsChange, onAddItem, } = this.props;
            const { searchTerm } = this.state;
            if (searchTerm) {
                const newItemId = searchTerm
                    .split(' ')
                    .filter(word => word.length)
                    .join('-');
                const newItem = {
                    [uniqueKey]: newItemId,
                    [displayKey]: searchTerm
                };
                if (onAddItem) {
                    onAddItem([...items, newItem]);
                }
                if (onSelectedItemsChange) {
                    onSelectedItemsChange([...selectedItems, newItem[uniqueKey]]);
                }
                this._clearSearchTerm();
            }
        };
        this._toggleItem = (item) => {
            const { single, uniqueKey, selectedItems, onSelectedItemsChange, } = this.props;
            if (single) {
                this._submitSelection();
                if (onSelectedItemsChange) {
                    onSelectedItemsChange([item[uniqueKey]]);
                }
            }
            else {
                const status = this._itemSelected(item);
                let newItems = [];
                if (status) {
                    newItems = reject(selectedItems, (singleItem) => item[uniqueKey] === singleItem);
                }
                else {
                    newItems = [...selectedItems, item[uniqueKey]];
                }
                // broadcast new selected items state to parent component
                if (onSelectedItemsChange) {
                    onSelectedItemsChange(newItems);
                }
            }
        };
        this._itemStyle = (item) => {
            const { selectedItemFontFamily, selectedItemTextColor, itemFontFamily, itemTextColor, itemFontSize, } = this.props;
            const isSelected = this._itemSelected(item);
            const style = { fontSize: itemFontSize };
            if (isSelected && selectedItemFontFamily) {
                style.fontFamily = selectedItemFontFamily;
            }
            else if (!isSelected && itemFontFamily) {
                style.fontFamily = itemFontFamily;
            }
            if (isSelected) {
                style.color = selectedItemTextColor;
            }
            else if (item.disabled) {
                style.color = 'grey';
            }
            else {
                style.color = itemTextColor;
            }
            return style;
        };
        this._getRow = (item) => {
            const { selectedItemIconColor, displayKey } = this.props;
            return (React.createElement(TouchableOpacity, { disabled: item.disabled, onPress: () => this._toggleItem(item), style: styles.rowTouchableOpacity },
                React.createElement(View, null,
                    React.createElement(View, { style: styles.itemContainer },
                        React.createElement(Text, { style: [
                                styles.itemText,
                                this._itemStyle(item),
                            ] }, item[displayKey]),
                        this._itemSelected(item) ? (React.createElement(Icon, { name: "check", style: [
                                styles.itemCheckIcon,
                                { color: selectedItemIconColor }
                            ] })) : null))));
        };
        this._getRowNew = (item) => {
            const { displayKey } = this.props;
            return (React.createElement(TouchableOpacity, { disabled: item.disabled, onPress: this._addItem, style: styles.rowTouchableOpacity },
                React.createElement(View, null,
                    React.createElement(View, { style: styles.itemContainer },
                        React.createElement(Text, { style: [
                                styles.itemText,
                                this._itemStyle(item),
                            ] },
                            "Add ",
                            item[displayKey],
                            " (tap or press return)")))));
        };
        this._filterItems = (searchTerm) => {
            const { items, displayKey } = this.props;
            const parts = searchTerm.trim().split(MultiSelect.SEARCH_SPLIT_REGEXP).map(escapeStringRegexp);
            const regex = new RegExp(parts.join('|'), 'i');
            return items.filter((item) => regex.test(get(item, displayKey)));
        };
        this._renderItems = () => {
            const { canAddItems, items, fontFamily, uniqueKey, selectedItems, displayKey } = this.props;
            const { searchTerm } = this.state;
            // If searchTerm matches an item in the list, we should not add a new
            // element to the list.
            let searchTermMatch = false;
            let itemList = null;
            let addItemRow = null;
            const renderItems = searchTerm ? this._filterItems(searchTerm) : items;
            if (renderItems.length) {
                itemList = (React.createElement(FlatList, { data: renderItems, extraData: selectedItems, keyExtractor: (item) => item[uniqueKey], renderItem: (rowData) => this._getRow(rowData.item) }));
                searchTermMatch = renderItems.some(item => item.name === searchTerm);
            }
            else if (!canAddItems) {
                itemList = (React.createElement(View, { style: styles.itemContainer },
                    React.createElement(Text, { style: [
                            styles.noItemsText,
                            fontFamily ? { fontFamily } : {},
                        ] }, "No item to display.")));
            }
            if (canAddItems && !searchTermMatch && searchTerm.length) {
                addItemRow = this._getRowNew({ [displayKey]: searchTerm });
            }
            return (React.createElement(View, null,
                itemList,
                addItemRow));
        };
        this.state = {
            selector: false,
            searchTerm: '',
        };
    }
    _selectorViewStyle() {
        const { fixedHeight } = this.props;
        const style = [styles.selectorView];
        if (fixedHeight) {
            style.push(styles.selectorViewFixedHeight);
        }
        return style;
    }
    _renderOpen() {
        const { single, searchInputPlaceholderText, searchInputStyle, hideSubmitButton, } = this.props;
        const { searchTerm } = this.state;
        return (React.createElement(View, { style: this._selectorViewStyle() },
            React.createElement(View, { style: styles.inputGroup },
                React.createElement(Icon, { name: "magnify", size: 20, color: colorPack.placeholderTextColor, style: styles.searchIcon }),
                React.createElement(TextInput, { autoFocus: true, onChangeText: this._onChangeInput, blurOnSubmit: false, onSubmitEditing: this._addItem, placeholder: searchInputPlaceholderText, placeholderTextColor: colorPack.placeholderTextColor, underlineColorAndroid: "transparent", style: [searchInputStyle, styles.searchInput], value: searchTerm }),
                hideSubmitButton && this._renderIndicatorOpen()),
            React.createElement(View, { style: styles.itemsWrapper },
                React.createElement(View, null, this._renderItems()),
                !(single || hideSubmitButton) && this._renderSubmitButton())));
    }
    _renderIndicatorOpen() {
        return (React.createElement(TouchableOpacity, { onPress: this._submitSelection },
            React.createElement(Icon, { name: "menu-down", style: [
                    styles.indicator,
                    styles.indicatorOpen,
                ] })));
    }
    _renderSubmitButton() {
        const { fontFamily, submitButtonColor, submitButtonText, } = this.props;
        return (React.createElement(TouchableOpacity, { onPress: () => this._submitSelection(), style: [
                styles.button,
                { backgroundColor: submitButtonColor },
            ] },
            React.createElement(Text, { style: [
                    styles.buttonText,
                    fontFamily ? { fontFamily } : {},
                ] }, submitButtonText)));
    }
    _renderClosed() {
        const { selectedItems, single, fontFamily, altFontFamily, hideSubmitButton, fontSize, textColor, hideTags, selectLabelStyle } = this.props;
        const inputFontFamily = altFontFamily || fontFamily;
        return (React.createElement(View, null,
            React.createElement(View, { style: styles.dropdownView },
                React.createElement(View, { style: [
                        styles.subSection
                    ] },
                    React.createElement(TouchableWithoutFeedback, { onPress: this._toggleSelector },
                        React.createElement(View, { style: styles.closedInputWrapper },
                            React.createElement(Text, { style: [
                                    styles.searchInput,
                                    Object.assign({ fontSize: fontSize || 16, color: textColor || colorPack.placeholderTextColor }, (inputFontFamily ? { fontFamily: inputFontFamily } : {})),
                                    selectLabelStyle
                                ], numberOfLines: 1 }, this._getSelectLabel()),
                            React.createElement(Icon, { name: hideSubmitButton
                                    ? 'menu-right'
                                    : 'menu-down', style: styles.indicator }))))),
            !(single || hideTags) && selectedItems.length ? this._renderSelectedItems() : null));
    }
    _renderSelectedItems() {
        return (React.createElement(View, { style: styles.selectedItems }, this._displaySelectedItems()));
    }
    render() {
        const { selector } = this.state;
        return (React.createElement(View, { style: styles.container }, selector ? this._renderOpen() : this._renderClosed()));
    }
}
MultiSelect.defaultProps = {
    single: false,
    selectedItems: [],
    items: [],
    uniqueKey: '_id',
    tagBorderColor: colorPack.primary,
    tagTextColor: colorPack.primary,
    fontFamily: '',
    tagRemoveIconColor: colorPack.danger,
    onSelectedItemsChange: () => {
    },
    selectedItemFontFamily: '',
    selectedItemTextColor: colorPack.primary,
    itemFontFamily: '',
    itemTextColor: colorPack.textPrimary,
    itemFontSize: 16,
    selectedItemIconColor: colorPack.primary,
    searchInputPlaceholderText: 'Search',
    searchInputStyle: { color: colorPack.textPrimary },
    textColor: colorPack.textPrimary,
    selectText: 'Select',
    altFontFamily: '',
    hideSubmitButton: false,
    submitButtonColor: '#CCC',
    submitButtonText: 'Submit',
    fontSize: 14,
    fixedHeight: false,
    hideTags: false,
    onChangeInput: () => {
    },
    displayKey: 'name',
    canAddItems: false,
    onAddItem: () => {
    },
};
MultiSelect.SEARCH_SPLIT_REGEXP = /[ \-:]+/;
