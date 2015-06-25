'use strict';

import FixedDataTable from 'fixed-data-table';
import Icon from './icon.react';
import Popover from './popover.react';

var cx = React.addons.classSet;
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;

export default React.createClass({
    displayName: 'QueryVisualizationTable',
    propTypes: {
        data: React.PropTypes.object,
        sort: React.PropTypes.array,
        setSortFn: React.PropTypes.func,
        isCellClickableFn: React.PropTypes.func,
        cellClickedFn: React.PropTypes.func
    },

    // local variables
    isColumnResizing: false,

    // React lifecycle
    getDefaultProps: function() {
        return {
            maxRows: 2000,
            minColumnWidth: 75
        };
    },

    getInitialState: function() {
        return {
            width: 0,
            height: 0,
            columnWidths: [],
            colDefs: null,
            popover: null
        };
    },

    componentWillMount: function() {
        if (this.props.data) {
            this.setState({
                colDefs: JSON.stringify(this.props.data.cols)
            });
        }
    },

    componentWillReceiveProps: function(newProps) {
        // TODO: check if our data has changed and specifically if our columns list has changed
        if (JSON.stringify(newProps.data.cols) !== this.state.colDefs) {
            // if the columns have changed then reset any column widths we have setup
            this.setState({
                colDefs: JSON.stringify(this.props.data.cols),
                columnWidths: this.calculateColumnWidths(this.state.width, this.props.minColumnWidth, newProps.data.cols)
            });
        }
    },

    componentDidMount: function() {
        this.calculateSizing(this.getInitialState());
    },

    componentDidUpdate: function(prevProps, prevState) {
        this.calculateSizing(prevState);
    },

    // availableWidth, minColumnWidth, # of columns
    // previousWidths, prevWidth
    calculateColumnWidths: function(availableWidth, minColumnWidth, colDefs, prevAvailableWidth, prevColumnWidths) {
        // TODO: maintain column spacing on a window resize

        var calcColumnWidth = (colDefs.length > 0) ? availableWidth / colDefs.length : minColumnWidth;
        var columnWidths = colDefs.map(function (column, idx) {
            return (minColumnWidth > calcColumnWidth) ? minColumnWidth : calcColumnWidth;
        });

        return columnWidths;
    },

    calculateSizing: function(prevState) {
        var element = this.getDOMNode(); //React.findDOMNode(this);

        // account for padding above our parent
        var style = window.getComputedStyle(element.parentElement, null);
        var paddingTop = Math.ceil(parseFloat(style.getPropertyValue("padding-top")));

        var width = element.parentElement.offsetWidth;
        var height = element.parentElement.offsetHeight - paddingTop;

        if (width !== prevState.width || height !== prevState.height) {
            var updatedState = {
                width: width,
                height: height
            };

            if (width !== prevState.width) {
                // NOTE: we remove 2 pixels from width to allow for a border pixel on each side
                var tableColumnWidths = this.calculateColumnWidths(width - 2, this.props.minColumnWidth, this.props.data.cols, prevState.width, prevState.columnWidths);
                updatedState.columnWidths = tableColumnWidths;
            }

            this.setState(updatedState);
        }
    },

    isSortable: function() {
        return (this.props.setSortFn !== undefined);
    },

    setSort: function(fieldId) {
        this.setState({
            metadataField: null
        })
        this.props.setSortFn(fieldId);
    },

    cellClicked: function(rowIndex, columnIndex) {
        this.props.cellClickedFn(rowIndex, columnIndex);
    },

    popoverFilterClicked: function(rowIndex, columnIndex, operator) {
        this.props.cellClickedFn(rowIndex, columnIndex, operator);
    },

    rowGetter: function(rowIndex) {
        var row = {
            hasPopover: this.state.popover && this.state.popover.rowIndex === rowIndex || false
        };
        for (var i = 0; i < this.props.data.rows[rowIndex].length; i++) {
            row[i] = this.props.data.rows[rowIndex][i];
        }
        return row;
    },

    showPopover: function(rowIndex, cellDataKey) {
        this.setState({
            popover: {
                rowIndex: rowIndex,
                cellDataKey: cellDataKey
            }
        });
    },

    setCurrentCell: function (rowIndex, cellDataKey) {
        this.setState({
            currentRowIndex: rowIndex,
            currentCellDataKey: cellDataKey
        });
    },

    cellRenderer: function(cellData, cellDataKey, rowData, rowIndex, columnData, width) {
        // TODO: should we be casting all values toString()?
        cellData = (cellData !== null) ? cellData.toString() : null;

        var key = 'cl'+rowIndex+'_'+cellDataKey;
        if (this.props.cellIsClickableFn(rowIndex, cellDataKey)) {
            return (<a className="link" href="#" onClick={this.cellClicked.bind(null, rowIndex, cellDataKey)}>{cellData}</a>);
        } else {
            var popover = null;
            if (this.state.popover && this.state.popover.rowIndex === rowIndex && this.state.popover.cellDataKey === cellDataKey) {
                var tetherOptions = {
                    targetAttachment: "middle middle",
                    attachment: "middle middle"
                };
                var operators = [">", "=", "!=", "<"].map(function(operator) {
                    return (<li key={operator} className="inline-block bordered text-brand-hover text-white-hover rounded p1" onClick={this.popoverFilterClicked.bind(null, rowIndex, cellDataKey, operator)}>{operator}</li>);
                }, this);
                popover = (
                    <Popover tetherOptions={tetherOptions}>
                        <div className="bg-white bordered shadowed p4">
                            <ul>{operators}</ul>
                        </div>
                    </Popover>
                );
            }
            return (
                <div key={key}>
                    <div onClick={this.showPopover.bind(null, rowIndex, cellDataKey)}>{cellData}</div>
                    {popover}
                </div>
            );
        }
    },

    columnResized: function(width, idx) {
        var tableColumnWidths = this.state.columnWidths;
        tableColumnWidths[idx] = width;
        this.setState({
            columnWidths: tableColumnWidths
        });
        this.isColumnResizing = false;
    },

    tableHeaderRenderer: function(columnIndex) {
        var column = this.props.data.cols[columnIndex],
            colVal = (column !== null) ? column.name.toString() : null;


        var headerClasses = cx({
            'MB-DataTable-header' : true,
            'flex': true,
            'align-center': true,
            'text-align-right': true,
            'MB-DataTable-header--sorted': (this.props.sort && (this.props.sort[0][0] === column.id)),
        });

        // set the initial state of the sorting indicator chevron
        var sortFn;

        if (this.isSortable()) {
            // ICK.  this is hacky for dealing with aggregations.  need something better
            var fieldId = (column.id) ? column.id : "agg";
            sortFn = this.setSort.bind(null, fieldId);
        }

        var metadataPopover;
        if(this.state.metadataField === column.id) {
            var tetherOptions = {
                attachment: "top middle",
                targetAttachment: "bottom middle",
            };
            console.log(column)
            metadataPopover = (
                <Popover tetherOptions={tetherOptions}
                    className="PopoverBody PopoverBody--withArrow p4">
                        <ul>
                            <li>
                                Description:
                                <div className="text-bold mb1">
                                    {column.description}
                                </div>
                            </li>
                            <li>
                                Type:
                                <div className="text-bold mb1">
                                    {column.base_type}
                                </div>
                            </li>
                            <li>
                                Metabase Type:
                                <div className="text-bold mb1">
                                    {column.special_type}
                                </div>
                            </li>
                        </ul>
                </Popover>
            )
        }

        return (
            <div key={columnIndex} className={headerClasses} onMouseEnter={this.showMetadataForField.bind(null, column.id)} onMouseLeave={this.hideMetadataForField.bind(null, column.id)}>
                {this.renderBreakoutTrigger(column.id)}
                <span className="inline-block flex-align-right" onClick={sortFn}>
                    {this.renderSortIndicator()}
                    {colVal}
                    {metadataPopover}
                </span>
            </div>
        );
    },

    showMetadataForField: function (columnId) {
        // if we already have one then set it immediately to prevent jumping
        if(this.state.metadataField) {
            this.setState({
                metadataField: columnId
            });
        } else {
            setTimeout(function () {
                this.setState({
                    metadataField: columnId
                });
            }.bind(this), 1000);
        }
    },

    hideMetadataForField: function (columnId) {
        this.setState({
            metadataField: null
        });
    },

    updateDimension: function(dimension, index) {
        var query = this.props.query;
        query.query.breakout[index] = dimension;

        this.setQuery(query, true);
    },

    setQuery: function(dataset_query, notify) {
        this.props.notifyQueryModifiedFn(dataset_query);
    },

    renderBreakoutTrigger: function (columnId) {
        if (this.props.metadata &&
                this.props.metadata.breakout_options.fields.length > 0) {
                var breakouts = this.props.metadata.breakout_options.fields;
                for(var b in breakouts) {
                    if(breakouts[b][0] === columnId) {
                        return (
                            <span className="BreakoutTrigger text-brand" onClick={this.updateDimension.bind(null, columnId, 0)}>
                                <Icon name="add" width="16px" height="16px" />
                            </span>
                        );
                    }
                }
        }
    },

    renderSortIndicator: function () {
        if(this.isSortable()) {
            var sortChevron = (<Icon name="chevrondown" width="8px" height="8px"></Icon>);

            if(this.props.sort && this.props.sort[0][1] === 'ascending') {
                sortChevron = (<Icon name="chevronup" width="8px" height="8px"></Icon>);
            }
            return (
                <span className="SortIndicator mr1">
                    {sortChevron}
                </span>
            )
        }
    },

    render: function() {
        if(!this.props.data) {
            return false;
        }

        var component = this;
        var tableColumns = this.props.data.cols.map(function (column, idx) {
            var colVal = (column !== null) ? column.name.toString() : null;
            var colWidth = component.state.columnWidths[idx];

            colWidth = 200;

            var align = "right";
            if(idx === 0) {
                align="left"
            }

            var columnClasses = cx({
                'MB-DataTable-column': true,
            })


            return (
                <Column
                    key={'col_' + idx}
                    className={columnClasses}
                    width={colWidth}
                    isResizable={true}
                    headerRenderer={component.tableHeaderRenderer.bind(null, idx)}
                    cellRenderer={component.cellRenderer}
                    dataKey={idx}
                    label={colVal}
                    align={align}
                    >
                </Column>
            );
        });

        return (
            <Table
                className="MB-DataTable"
                rowHeight={55}
                rowGetter={this.rowGetter}
                rowsCount={this.props.data.rows.length}
                width={this.state.width}
                height={this.state.height}
                headerHeight={75}
                isColumnResizing={this.isColumnResizing}
                onColumnResizeEndCallback={component.columnResized}>
                {tableColumns}
            </Table>
        );
    }
});
