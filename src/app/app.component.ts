import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as d3Sankey from 'd3-sankey';

import MyData from './data';
import MyData2 from './data2';
// lots of help from
// http://bl.ocks.org/FabricioRHS/a6410950d8e38e9afefc4ca33a8898fc 

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  message = 'nothing clicked'

  margin = { top: 10, right: 10, bottom: 10, left: 10 }

  container = null;
  linkContainer = null;
  nodeContainer = null;
  nodeWidth = 10;
  nodePadding = 15;

  filter = 'all';

  ngOnInit(): void {
    this.initializeChart();
  }

  // Reformats data kinda (mostly to keep compiler happy)
  public getSankeyData(): d3Sankey.SankeyGraph<{}, {}> {

    let data: any = MyData;

    if (this.filter == "closed") {
      data = MyData2;
    }



    const x: d3Sankey.SankeyGraph<{}, {}> = {
      nodes: [], links: []
    };

    x.links = data['links'];
    x.nodes = data['nodes'];
    return x;
  }

  public doFilter(filter) {
    this.filter = filter;
    this.resize();

  }

  public doClick(d): void {
    if (d.nodeType == "city") {
      this.message = "You clicked on the city " + d.name
      return;
    }
    if (d.nodeType == "severity") {
      this.message = "You clicked on the severity " + d.name
      return;
    }
    if (d.nodeType == "status") {
      this.message = "You clicked on the status " + d.name
      return;
    }
    this.message = "You clicked on " + d.nodeType
  };

  public doLinkClick(l): void {

    if (l.link == "severity") {
      this.message = "You clicked on the severity of  " + l.target.name + " from " + l.source.name
      return;
    }
    if (l.link == "status") {
      this.message = "You clicked on the status " + l.target.name + " from " + l.source.name
      return;
    }

  };

  getDimensions(container, margin) {
    const bbox = container.node().getBoundingClientRect();
    const width = bbox.width - margin.left - margin.right;
    const height = bbox.height - margin.top - margin.bottom;
    return { width, height }
  }

  // global  stuff
  formatNumber = d3.format(",.0f");
  format = function (d: any) { return this.formatNumber(d); }

  changeOpacity(element, amount) {
    d3.select(element).style("stroke-opacity", amount)
  }

  changeFill(element, amount) {
    d3.select(element).style("fill", amount)
  }

  private initializeChart() {

    this.container = d3.select('#chart');
    const dim = this.getDimensions(this.container, this.margin);

    let svg = this.container
      .append('svg')
      .attr('width', dim.width + this.margin.left + this.margin.right)
      .attr('height', dim.height + this.margin.top + this.margin.bottom);

    const sankeyContainer = svg.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    const sankey = d3Sankey.sankey()
      .nodeWidth(this.nodeWidth)
      .nodePadding(this.nodePadding)
      .iterations(0)   // fixes order
      .extent([[1, 1], [dim.width - 1, dim.height - 6]]);

    const graph = sankey(this.getSankeyData());
    sankey.update(graph)
    this.linkContainer = sankeyContainer.append("g").attr("class", "linkContainer")
    this.nodeContainer = sankeyContainer.append("g").attr("class", "nodeContainer")

    this.updateNodes(this.nodeContainer, graph.nodes, dim.width);
    this.updateLinks(this.linkContainer, graph.links);

    d3.select(window).on('resize', d => { this.resize() });
  };


  updateLinks(linkContainer, linkData) {

    // see https://bl.ocks.org/mbostock/3808218 for an explaination
    // of the join/update/exit pattern

    // DATA JOIN
    // Join new data with old elements
    const links = linkContainer.selectAll('.links')
      //.data(linkData);
      // something a little more unique
      .data(linkData, d => `${d.source}-${d.target}`);

    // EXIT
    // Remove elements not present in new data
    links.exit().remove();

    // UPDATE
    // Update old elements
    // For links...we just fetch a new generator
    // Otherwise nothing resizes
    links.attr('d', d3Sankey.sankeyLinkHorizontal());

    // ENTER
    // Add New Links as needed
    // this will only get called once per link
    let enteringLinks = links
      .enter().append("path")
      .attr("class", "links")
      .attr("d", d3Sankey.sankeyLinkHorizontal())
      .attr("stroke", "#aaaaaa")
      .attr("stroke-opacity", 0.3)
      .attr("fill", "none")
      .attr("stroke-width", function (d: any) { return Math.max(1, d.width); })

    // Add mouseovers, clicks and tooltips
    enteringLinks
      .on("mouseover", (_, i, n) => { this.changeOpacity(n[i], 0.7) })
      .on("mouseout", (_, i, n) => { this.changeOpacity(n[i], 0.3) })
      .on("click", d => { this.doLinkClick(d) })
      .append("title")
      .text(d => {
        return d.source.name + " → " + d.target.name + "\n" + this.format(d.value) + " Alerts";
      });

  }

  /**
   * join/update/exit nodes
   * Need new width
   */
  updateNodes(nodeContainer, nodeData, width) {

    // Join new data with old elements
    const nodes = nodeContainer.selectAll('.nodes')
      //.data(nodeData)
      .data(nodeData, d => {
        if (d.name == "Closed") {
          console.log(d)
        }

        return `$(d.name)`
      });
    // Remove elements not present in new data
    nodes.exit().remove();


    // Update old elements
    nodes
      .selectAll("rect")
      .attr("x", d => { return d.x0; })
      .attr("y", d => {
        if (d.name == "Closed") {
          console.log("y:" + d.y0)
        }

        return d.y0;
      })

      .attr("height", d => { return d.y1 - d.y0; })
      .attr("width", d => { return d.x1 - d.x0; })

    nodes.selectAll("text")
      .attr('x', function (d: any) { return d.x0 - 6; })
      .attr('y', function (d: any) { return (d.y1 + d.y0) / 2; })
      .filter(d => { return d.x0 < width / 2; })
      .attr('x', function (d: any) { return d.x1 + 6; })
      .attr('text-anchor', 'start');

    // Enter new elements
    let enteringNodes = nodes.enter()
      .append("g")
      .attr("class", "nodes")


    enteringNodes.append("rect")

      .attr("height", d => { return d.y1 - d.y0; })

      .attr("width", d => { return d.x1 - d.x0; })

      .attr("x", d => { return d.x0; })
      .attr("y", d => { return d.y0; })





    // set mouseovers/clicks
    enteringNodes
      .on("mouseover", (_, i, n) => {
        this.changeFill(n[i], "#bbbbbb")
      })
      .on("mouseout", (d, i, n) => {
        this.changeFill(n[i], d.color)
      })
      .on("click", d => {
        this.doClick(d)
      })
      .attr("fill", d => { return d.color; })
    enteringNodes.append('title')
      .text(d => { return d.name + '\n' + this.format(d.value); });

    // Set size, fill, font
    let textNodes = enteringNodes.append("text")
      .attr('dy',
        d => {
          return '0.35em'
        }

      )   // can be used to adjust ht location
      .attr('text-anchor', 'end')
      .attr('fill', '#bbbbbb')
      .attr('font-size', 14)
      .text(d => { return d.name; })

      // set location
      // textNodes
      .attr('x', d => { return d.x0 - 6; })
      .attr('y', d => {
        let nudge = 0
        if (d.y1 < 10) {
          //   console.log(d)
          nudge = 4
        }
        return (d.y1 + d.y0) / 2 + nudge;
      }
      )
      .filter(d => { return d.x0 < width / 2; })
      .attr('x', function (d: any) { return d.x1 + 6; })
      .attr('text-anchor', 'start');
  }


  resize() {

    const updatedDimensions = this.getDimensions(this.container, this.margin);

    this.container
      .selectAll('svg')
      .attr('width', updatedDimensions.width + this.margin.left + this.margin.right)
      .attr('height', updatedDimensions.height + this.margin.top + this.margin.bottom);

    // recalc layout
    var newSankey = d3Sankey.sankey()
      .nodeWidth(this.nodeWidth)
      .nodePadding(this.nodePadding)
      .iterations(0)   // fixes order
      .extent([[1, 1], [updatedDimensions.width - 1, updatedDimensions.height - 6]])
      ;



    const graph = newSankey(this.getSankeyData());


    this.updateLinks(this.linkContainer, graph.links);
    this.updateNodes(this.nodeContainer, graph.nodes, updatedDimensions.width);
  }

}