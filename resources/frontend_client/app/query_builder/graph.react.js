'use strict';

import d3 from 'd3';

var cx = React.addons.classSet;

export default React.createClass({
    displayName: 'Graph',

    getDefaultProps: function() {
        return {
            width: 600,
            height: 600
        };
    },

    render: function() {
        return <svg width={this.props.width+"px"} height={this.props.height+"px"} style={{"margin-left":"-1.5rem"}}></svg>;
    },

    componentDidMount: function() {
        var svg = d3.select(this.getDOMNode());

        svg.append('svg:defs').append('svg:marker')
            .attr('id', 'arrowhead')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 6)
            .attr('markerWidth', 3)
            .attr('markerHeight', 3)
            .attr('orient', 'auto')
        .append('svg:path')
            .attr('d', 'M0,-5L10,0L0,5')

        this.updateGraph(this.props);
    },

    shouldComponentUpdate: function(props) {
        this.updateGraph(props);
        return false;
    },

    updateGraph: function(props) {
        var nodes = props.nodes;
        var links = props.links;
        var linksWithDummies = props.links.slice();

        var directedPairs = {};
        var undirectedPairs = {}
        links.forEach((link) => {
            var sId = link.source.id;
            var tId = link.target.id;
            var directedKey = sId+'->'+tId;
            var undirectedKey = Math.min(sId, tId)+'-'+Math.max(sId, tId); // deterministic order
            directedPairs[directedKey] = (directedPairs[directedKey] || 0) + 1;
            undirectedPairs[undirectedKey] = (undirectedPairs[undirectedKey] || 0) + 1;
            link.directedIndex = directedPairs[directedKey] - 1;
            link.undirectedIndex = undirectedPairs[undirectedKey] - 1;
        });

        nodes.forEach((source) => {
            nodes.forEach((target) => {
                var sId = source.id;
                var tId = target.id;
                var undirectedKey = Math.min(sId, tId)+'-'+Math.max(sId, tId); // deterministic order
                if (source !== target && undirectedPairs[undirectedKey] === undefined) {
                    linksWithDummies.push({ source, target, dummy: true });
                }
            })
        })

        var svg = d3.select(this.getDOMNode());
        var path = svg.append('svg:g').selectAll('path');
        var circle = svg.append('svg:g').selectAll('g');

        // update force layout (called automatically each iteration)
        function tick() {
          // draw directed edges with proper padding from node centers
          path.attr('d', function(d) {
            var deltaX = d.target.x - d.source.x,
                deltaY = d.target.y - d.source.y,
                dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
                normX = deltaX / dist,
                normY = deltaY / dist,
                sourcePadding = (d.source.radius || 30),
                targetPadding = (d.target.radius || 30) + 6,
                offset = 10 * (d.undirectedIndex % 2 ? -1 : 1) * Math.round(d.undirectedIndex / 2),
                sourceX = d.source.x + (sourcePadding * normX) + (offset * normY),
                sourceY = d.source.y + (sourcePadding * normY) - (offset * normX),
                targetX = d.target.x - (targetPadding * normX) + (offset * normY),
                targetY = d.target.y - (targetPadding * normY) - (offset * normX);
            return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
          });

          circle.attr('transform', function(d) {
            return 'translate(' + d.x + ',' + d.y + ')';
          });
        }

        // path (link) group
        path = path.data(links, (d) => d.id);

        // update existing links
        path.style('marker-end', 'url(#arrowhead)');

        // add new links
        path.enter().append('svg:path')
          .attr('class', 'DataReference-link')
          .style('marker-end', 'url(#arrowhead)')
          .on('click', (d) => this.props.onClickLink(d));

        // remove old links
        path.exit().remove();

        // circle (node) group
        circle = circle.data(nodes, (d) => d.id);

        // update existing nodes
        circle.selectAll('circle');

        // add new nodes
        var g = circle.enter().append('svg:g')
          .attr('class', 'DataReference-node');

        g.append('svg:circle')
          .attr('r', (d) => (d.radius || 30))
          .on('click', (d) => this.props.onClickNode(d));

        // show node IDs
        g.append('svg:text')
            .attr('x', 0)
            .attr('y', 4)
            .attr("text-anchor", "middle")
            .text(function(d) { return d.display_name; });

        // remove old nodes
        circle.exit().remove();


        console.log()
        var force = d3.layout.force()
            .nodes(nodes)
            .links(linksWithDummies)
            .size([this.props.width, this.props.height])
            .linkStrength((d) => d.dummy ? 0.1 : 0.5)
            .friction(0.9)
            .linkDistance((d) => d.dummy ? 250 : 200)
            .charge(-30)
            .gravity(0.1)
            .theta(0.8)
            .alpha(0.1);
        force.on("tick", tick);
        force.start();
     }
});
