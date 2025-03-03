---
title: OrgChart
tags: ["organization"]
---
## OrgChart Component

### Props
| Property           | Description                                                                               | Type                                                                                                     | Default |
|---------------------|-------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|---------|
| `data`              | The data items visualized by the organization chart.                                       | `T[]`                                                                                                    | -       |
| `onItemFocus`       | A callback that's called when an item is focused.                                          | `(item: T \| null) => void`                                                                              | -       |
| `onItemSelect`      | A callback that's called when an item is selected or deselected.                            | `(selectedItems: T[]) => void`                                                                           | -       |
| `onItemHover`       | A callback that's called when the hovered item has changed.                                | `(item: T \| null, oldItem?: T \| null) => void`                                                         | -       |
| `searchNeedle`      | A string or a complex object to search for.                                                | `TNeedle`                                                                                                | -       |
| `onSearch`          | An optional callback that returns whether the given item matches the search needle.        | `(item: T, needle: TNeedle) => boolean`                                                                  | -       |
| `renderItem`        | A function that provides a custom render function for the given data item.                  | `ComponentType<RenderItemProps<T>> \| undefined`                                                         | -       |
| `connectionStyles`  | A function that provides a style configuration for the given edge.                           | `(source: T, target: T) => ConnectionStyle \| undefined`                                                 | -       |
| `className`         | Specifies the CSS class used for the `OrgChart` component.                                  | `string`                                                                                                 | -       |
| `interactive`       | Specifies whether the interactive collapse and expand buttons on the orgchart nodes are visible. The default is true. | `boolean`                                                                                                | `true`  |
| `style`             | Specifies the CSS style used for the `OrgChart` component.                                  | `CSSProperties`                                                                                          | -       |
| `itemSize`          | Specifies the default item size used when no explicit width and height are provided.        | `{ width: number; height: number }`                                                                      | -       |
| `renderTooltip`     | An optional function that renders the tooltip.                                              | `ComponentType<RenderTooltipProps<T>>`                                                                   | -       |
| `contextMenuItems`  | An optional function specifying the context menu items for a data item.                      | `(item: T \| null) => ContextMenuItem<T>[]`                                                              | -       |
| `renderContextMenu` | An optional function that renders the context menu. This function can be used to provide a custom component that renders the context menu. | `ComponentType<RenderContextMenuProps<T>>`                                                               | -       |
| `popupPosition`     | The optional position of the popup. The default is 'north'.                                  | `'right' \| 'top' \| 'top-right' \| 'top-left' \| 'bottom' \| 'bottom-right' \| 'bottom-left' \| 'left'` | `'top'` |
| `renderPopup`       | An optional function that renders the popup. This function can be used to provide a custom component that renders the popup. | `ComponentType<RenderPopupProps<T>>`                                                                     | -       |
