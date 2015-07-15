'use strict';

import Icon from './icon.react';
import DataReferenceQueryButton from './data_reference_query_button.react';
import Graph from './graph.react';

import inflection from 'inflection';
import Promise from 'bluebird';

import Query from './query';

var cx = React.addons.classSet;

export default React.createClass({
    displayName: 'DataReferenceGraph',
    propTypes: {
        query: React.PropTypes.object.isRequired,
        loadTableFn: React.PropTypes.func.isRequired,
        closeFn: React.PropTypes.func.isRequired,
        runQueryFn: React.PropTypes.func.isRequired,
        setQueryFn: React.PropTypes.func.isRequired,
        setDatabaseFn: React.PropTypes.func.isRequired,
        setSourceTableFn: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return {
            nodes: [],
            links: []
        };
    },

    showFk: function(fk) {
        this.props.showField(fk.origin);
    },

    componentWillMount: function() {
        console.log(this.props.database);
        this.props.Metabase.db_tables({ 'dbId': this.props.database.id }).$promise
        .then((tables) => {
            return Promise.all(tables.map((table) => this.props.loadTableFn(table.id)));
        })
        .then((tables) => {
            var nodes = [];
            var links = [];
            var tableMap = {};
            tables.forEach(({ metadata, foreignKeys }) => {
                tableMap[metadata.id] = metadata;
                metadata.radius = 20 + (metadata.rows > 0 ? Math.log10(metadata.rows) * 10 : 0);
                nodes.push(metadata);
            });
            var seenLinks = {};
            tables.forEach(({ metadata, foreignKeys }) => {
                foreignKeys.forEach((fk) => {
                    var key = fk.origin.id + "." + fk.destination.id;
                    fk.source = tableMap[fk.origin.table.id];
                    fk.target = tableMap[fk.destination.table.id];
                    if (!seenLinks[key] && fk.source !== fk.target) {
                        links.push(fk);
                        seenLinks[key] = true;
                    }
                });
            });
            this.setState({ nodes, links });
        });
    },

    render: function(page) {
        return <Graph
            width={300}
            height={450}
            nodes={this.state.nodes}
            links={this.state.links}
            onClickNode={this.props.showTable}
            onClickLink={this.showFk}
        />;
    }
})
