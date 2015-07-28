'use strict';
/*global _*/

import { Table, Column } from 'fixed-data-table';
import Icon from './icon.react';

var cx = React.addons.classSet;

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
            minColumnWidth: 100
        };
    },

    isSortable: function() {
        return (this.props.setSortFn !== undefined);
    },

    setSort: function(fieldId) {
        this.props.setSortFn(fieldId);
    },

    cellClicked: function(rowIndex, columnIndex) {
        this.props.cellClickedFn(rowIndex, columnIndex);
    },

    rowGetter: function(rowIndex) {
        return this.props.data.rows[rowIndex];
    },

    cellRenderer: function(cellData, cellDataKey, rowData, rowIndex, columnData, width) {
        // TODO: should we be casting all values toString()?
        cellData = (cellData !== null) ? cellData.toString() : null;

        var key = 'cl'+rowIndex+'_'+cellDataKey;
        if (this.props.cellIsClickableFn(rowIndex, cellDataKey)) {
            return (<a key={key} className="link" href="#" onClick={this.cellClicked.bind(null, rowIndex, cellDataKey)}>{cellData}</a>);
        } else {
            return (<div key={key}>{cellData}</div>);
        }
    },

    tableHeaderRenderer: function(columnIndex) {
        var column = this.props.data.cols[columnIndex],
            colVal = (column !== null) ? (column.display_name.toString() || column.name.toString()) : null;

        var headerClasses = cx({
            'MB-DataTable-header' : true,
            'flex': true,
            'align-center': true,
            'MB-DataTable-header--sorted': (this.props.sort && (this.props.sort[0][0] === column.id)),
        });

        // set the initial state of the sorting indicator chevron
        var sortChevron = (<Icon name="chevrondown" width="8px" height="8px"></Icon>);

        if(this.props.sort && this.props.sort[0][1] === 'ascending') {
            sortChevron = (<Icon name="chevronup" width="8px" height="8px"></Icon>);
        }

        if (this.isSortable()) {
            // ICK.  this is hacky for dealing with aggregations.  need something better
            var fieldId = (column.id) ? column.id : "agg";

            return (
                <div key={columnIndex} className={headerClasses} onClick={this.setSort.bind(null, fieldId)}>
                    {colVal}
                    <span className="ml1">
                        {sortChevron}
                    </span>
                </div>
            );
        } else {
            return (<div className={headerClasses}>{colVal}</div>);
        }
    },

    render: function() {
        if(!this.props.data) {
            return false;
        }

        return (
            <Table
                className="MB-DataTable"
                rowHeight={25}
                rowGetter={this.rowGetter}
                rowsCount={this.props.data.rows.length}
                width={this.props.width}
                maxHeight={this.props.height}
                headerHeight={40}
                isColumnResizing={this.isColumnResizing}
                onColumnResizeEndCallback={this.columnResized}
            >
                { this.props.data.cols.map((column, index) => {
                    let colVal = (column !== null) ? column.name.toString() : null;
                    // let width = this.props.data.cols.length / this.props.width;
                    return (
                        <Column
                            key={'col_' + index}
                            className="MB-DataTable-column"
                            width={75}
                            isResizable={false}
                            headerRenderer={this.tableHeaderRenderer.bind(null, index)}
                            cellRenderer={this.cellRenderer}
                            dataKey={index}
                            label={colVal}>
                        </Column>
                    );
                }) }
            </Table>
        );
    }
});
