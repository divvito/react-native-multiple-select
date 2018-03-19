import * as React from 'react';
import { FlatList, Keyboard, View } from 'react-native';
import { find, get, reject } from 'lodash';
import escapeStringRegexp from 'escape-string-regexp';
import styles, { colorPack } from './styles';
import SelectedItems from './components/SelectedItems';
import NoItems from './components/NoItems';
import ClosedInput from './components/ClosedInput';
import SubmitButton from './components/SubmitButton';
import IndicatorOpen from './components/IndicatorOpen';
import ItemsWrapper from './components/ItemsWrapper';
import InputGroup from './components/InputGroup';
import ItemRow from './components/ItemRow';
import ItemRowNew from './components/ItemRowNew';
import SelectedItem from './components/SelectedItem';
export default class MultiSelect extends React.PureComponent {
    constructor(props) {
        super(props);
        this.getSelectedItemsExt = (optionalSelectedItems) => {
            const { selectedItemsExtStyle } = this.props;
            return (React.createElement(View, { style: [styles.selectedItemsExt, selectedItemsExtStyle] }, this._displaySelectedItems(optionalSelectedItems)));
        };
        this.open = () => {
            this.setState({
                selector: true,
            });
        };
        this.close = () => {
            this.setState({
                selector: false,
                searchTerm: ''
            });
        };
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
            const { selectedItems, displayKey, } = this.props;
            const actualSelectedItems = optionalSelectedItems || selectedItems;
            return actualSelectedItems.map((singleSelectedItem) => {
                const item = this._findItem(singleSelectedItem);
                if (!item) {
                    return null;
                }
                if (!item[displayKey]) {
                    return null;
                }
                return this._renderSelectedItem(item);
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
            Keyboard.dismiss();
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
            const { selectedItemFontFamily, selectedItemTextColor, itemFontFamily, itemTextColor, itemFontSize, disabledItemColor } = this.props;
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
                style.color = disabledItemColor;
            }
            else {
                style.color = itemTextColor;
            }
            return style;
        };
        this._filterItems = (searchTerm) => {
            const { items, displayKey } = this.props;
            const parts = searchTerm.trim().split(MultiSelect.SEARCH_SPLIT_REGEXP).map(escapeStringRegexp);
            const regex = new RegExp(parts.join('|'), 'i');
            return items.filter((item) => regex.test(get(item, displayKey)));
        };
        this._renderItems = () => {
            const { canAddItems, items, uniqueKey, selectedItems, displayKey, } = this.props;
            const { searchTerm } = this.state;
            // If searchTerm matches an item in the list, we should not add a new
            // element to the list.
            let searchTermMatch = false;
            let itemList = null;
            let addItemRow = null;
            const renderItems = searchTerm ? this._filterItems(searchTerm) : items;
            if (renderItems.length) {
                itemList = (React.createElement(FlatList, { data: renderItems, extraData: selectedItems, keyExtractor: (item) => item[uniqueKey], renderItem: (rowData) => this._renderItemRow(rowData.item), keyboardShouldPersistTaps: 'handled' }));
                searchTermMatch = renderItems.some(item => item.name === searchTerm);
            }
            else if (!canAddItems) {
                itemList = this._renderNoItems();
            }
            if (canAddItems && !searchTermMatch && searchTerm.length) {
                addItemRow = this._renderRowNew({ [displayKey]: searchTerm });
            }
            return (React.createElement(View, null,
                itemList,
                addItemRow));
        };
        this._renderRowNew = (item) => {
            const { displayKey, rowTouchableOpacityStyle, itemContainerStyle, itemTextStyle, getNewItemLabel, renderItemRowNew, } = this.props;
            const props = {
                onAdd: this._addItem,
                itemLabel: getNewItemLabel(item[displayKey]),
                itemStyle: this._itemStyle(item),
                item,
                itemContainerStyle,
                itemTextStyle,
                rowTouchableOpacityStyle
            };
            if (renderItemRowNew) {
                return renderItemRowNew(props);
            }
            else {
                return (React.createElement(ItemRowNew, Object.assign({}, props)));
            }
        };
        this._renderItemRow = (item) => {
            const { selectedItemIconColor, displayKey, rowTouchableOpacityStyle, itemContainerStyle, itemTextStyle, itemCheckIconStyle, renderItemRow, } = this.props;
            const props = {
                onPress: this._toggleItem,
                itemStyle: this._itemStyle(item),
                selected: this._itemSelected(item),
                item,
                displayKey,
                selectedItemIconColor,
                rowTouchableOpacityStyle,
                itemContainerStyle,
                itemTextStyle,
                itemCheckIconStyle,
            };
            if (renderItemRow) {
                return renderItemRow(props);
            }
            else {
                return (React.createElement(ItemRow, Object.assign({}, props)));
            }
        };
        this.state = {
            selector: false,
            searchTerm: '',
        };
    }
    _selectorViewStyle() {
        const { fixedHeight, selectorViewStyle } = this.props;
        const style = [styles.selectorView];
        if (fixedHeight) {
            style.push(styles.selectorViewFixedHeight);
        }
        if (selectorViewStyle) {
            style.push(selectorViewStyle);
        }
        return style;
    }
    _renderNoItems() {
        const { itemContainerStyle, noItemsTextStyle, fontFamily, noItemsText, renderNoItems } = this.props;
        const props = {
            itemContainerStyle,
            noItemsTextStyle,
            fontFamily,
            noItemsText,
        };
        if (renderNoItems) {
            return renderNoItems(props);
        }
        else {
            return (React.createElement(NoItems, Object.assign({}, props)));
        }
    }
    _renderOpen() {
        return (React.createElement(View, { style: this._selectorViewStyle() },
            this._renderInputGroup(),
            this._renderItemsWrapper()));
    }
    _renderInputGroup() {
        const { hideSubmitButton, inputGroupStyle, searchIconStyle, searchInputPlaceholderText, searchInputStyle, renderInputGroup, } = this.props;
        const { searchTerm } = this.state;
        const props = {
            indicatorOpen: hideSubmitButton ? this._renderIndicatorOpen() : null,
            onChange: this._onChangeInput,
            onAdd: this._addItem,
            inputGroupStyle,
            searchIconStyle,
            searchInputPlaceholderText,
            searchInputStyle,
            searchTerm,
        };
        if (renderInputGroup) {
            return renderInputGroup(props);
        }
        else {
            return (React.createElement(InputGroup, Object.assign({}, props)));
        }
    }
    _renderItemsWrapper() {
        const { itemsWrapperStyle, itemsContainerStyle, single, hideSubmitButton, renderItemsWrapper } = this.props;
        const props = {
            submitButton: !(single || hideSubmitButton) ? this._renderSubmitButton() : null,
            children: this._renderItems(),
            itemsWrapperStyle,
            itemsContainerStyle
        };
        if (renderItemsWrapper) {
            return renderItemsWrapper(props);
        }
        else {
            return (React.createElement(ItemsWrapper, Object.assign({}, props)));
        }
    }
    _renderIndicatorOpen() {
        const { renderIndicatorOpen, indicatorStyle, indicatorOpenStyle } = this.props;
        const props = {
            onPress: this._submitSelection,
            indicatorStyle,
            indicatorOpenStyle,
        };
        if (renderIndicatorOpen) {
            return renderIndicatorOpen(props);
        }
        else {
            return (React.createElement(IndicatorOpen, Object.assign({}, props)));
        }
    }
    _renderSubmitButton() {
        const { renderSubmitButton, fontFamily, submitButtonStyle, submitButtonTextStyle, submitButtonColor, submitButtonText, } = this.props;
        const props = {
            onPress: this._submitSelection,
            fontFamily,
            submitButtonStyle,
            submitButtonTextStyle,
            submitButtonColor,
            submitButtonText,
        };
        if (renderSubmitButton) {
            return renderSubmitButton(props);
        }
        else {
            return (React.createElement(SubmitButton, Object.assign({}, props)));
        }
    }
    _renderClosed() {
        const { selectedItems, single, hideTags, } = this.props;
        return (React.createElement(View, null,
            this._renderClosedInput(),
            !(single || hideTags) && selectedItems.length ? this._renderSelectedItems() : null));
    }
    _renderClosedInput() {
        const { closedInputWrapperStyle, textColor, fontSize, altFontFamily, fontFamily, selectLabelStyle, indicatorStyle, hideSubmitButton, renderClosedInput, subSectionStyle, dropdownViewStyle, } = this.props;
        const props = {
            onPress: this._toggleSelector,
            labelText: this._getSelectLabel(),
            inputFontFamily: altFontFamily || fontFamily,
            closedInputWrapperStyle,
            textColor,
            fontSize,
            selectLabelStyle,
            indicatorStyle,
            hideSubmitButton,
            subSectionStyle,
            dropdownViewStyle,
        };
        if (renderClosedInput) {
            return renderClosedInput(props);
        }
        else {
            return (React.createElement(ClosedInput, Object.assign({}, props)));
        }
    }
    _renderSelectedItems() {
        const { selectedItemsStyle, renderSelectedItems } = this.props;
        const props = {
            children: this._displaySelectedItems(),
            selectedItemsStyle
        };
        if (renderSelectedItems) {
            return renderSelectedItems(props);
        }
        else {
            return (React.createElement(SelectedItems, Object.assign({}, props)));
        }
    }
    _renderSelectedItem(item) {
        const { fontFamily, tagRemoveIconColor, tagBorderColor, uniqueKey, tagTextColor, displayKey, selectedItemStyle, selectedItemExtStyle, selectedItemExtTextStyle, selectedItemExtIconStyle, renderSelectedItem } = this.props;
        const props = {
            onRemove: this._removeItem,
            item,
            uniqueKey,
            displayKey,
            fontFamily,
            tagRemoveIconColor,
            tagBorderColor,
            tagTextColor,
            selectedItemStyle,
            selectedItemExtStyle,
            selectedItemExtTextStyle,
            selectedItemExtIconStyle,
        };
        if (renderSelectedItem) {
            return renderSelectedItem(props);
        }
        else {
            return (React.createElement(SelectedItem, Object.assign({}, props)));
        }
    }
    render() {
        const { containerStyle } = this.props;
        const { selector } = this.state;
        return (React.createElement(View, { style: [styles.container, containerStyle] }, selector ? this._renderOpen() : this._renderClosed()));
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
    searchInputPlaceholderColor: colorPack.placeholderTextColor,
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
    disabledItemColor: 'grey',
    noItemsText: 'No item to display.',
    getNewItemLabel: (name) => `Add ${name} (tap or press return)`,
};
MultiSelect.SEARCH_SPLIT_REGEXP = /[ \-:]+/;
