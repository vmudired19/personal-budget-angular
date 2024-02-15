import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../data.service';

import  Chart  from 'chart.js/auto';
import * as d3 from 'd3';



@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  public dataSource:any= {
    datasets: [
        {
            data: [],
            backgroundColor: [
              '#FFEBEE',
              '#F48FB1',
              '#BA68C8',
              '#CC9900',
              '#00695C',
              '#DCE775',
              '#E0F2F1',
              '#BCAAA4'
              ]
        }
    ],
    labels: []
};

public newDataSource: any = [];

private svg: any;
  private width = 600;
  private height = 600;
  // The radius of the pie chart is half the smallest side
  private radius = Math.min(this.width, this.height) / 2;
  private colors: any;
  private pie: any;
  private titles: string[] = [];

constructor(private dataService: DataService) {}

  private createSvg(): void {
    this.svg = d3
      .select('#pie-chart')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.width / 2 + ',' + this.height / 2 + ')'
      );
  }

  private createColors(): void {
    const titles = this.dataSource.labels;

    this.colors = d3
      .scaleOrdinal()
      .domain(titles)
      .range([
        '#A93226',
        '#C39BD3',
        '#7FB3D5',
        '#76D7C4',
        '#F4D03F',
        '#F0B27A',
        '#CACFD2',
        '#2E4053',
      ]);
  }


  private drawChart(): void {
    // Compute the position of each group on the pie:
    const pie = d3.pie<any>().value((d: any) => Number(d.budget));

    // Build the pie chart
    this.svg
      .selectAll('pieces')
      .data(pie(this.newDataSource))
      .enter()
      .append('path')
      .attr('d', d3.arc().innerRadius(0).outerRadius(this.radius))
      .attr('fill', (d: any, i: any) => this.colors(i))
      .attr('stroke', '#121926')
      .style('stroke-width', '1px');

    // Add labels
    const labelLocation = d3.arc().innerRadius(100).outerRadius(this.radius);

    this.svg
      .selectAll('pieces')
      .data(pie(this.newDataSource))
      .enter()
      .append('text')
      .text((d: any) => d.data.title)
      .attr(
        'transform',
        (d: any) => 'translate(' + labelLocation.centroid(d) + ')'
      )
      .style('text-anchor', 'middle')
      .style('font-size', 15);
  }


  createChart() {
    //var ctx = document.getElementById("mychart").getContext("2d");
    var ctx = document.getElementById("myChart") as HTMLCanvasElement;
    var myPieChart = new Chart (ctx, {
      type :'pie',
      data : this.dataSource



    });
}

ngOnInit(): void {
  if (
    this.dataSource.datasets[0].data.length == 0 ||
    this.newDataSource.length == 0
  ) {
    this.dataService.fetchDataFromBackend().subscribe((res: any) => {
      for (var i = 0; i < res.myBudget.length; i++) {
        this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
        this.dataSource.labels[i] = res.myBudget[i].title;

        this.newDataSource.push({
          title: res.myBudget[i].title,
          budget: res.myBudget[i].budget,
        });
      }
      this.dataService.setDataSource(this.dataSource);
      this.dataService.setNewDataSource(this.newDataSource);

      //console.log(this.dataService.getDataSource());
      this.createChart();
      this.createSvg();
      this.createColors();
      this.drawChart();
    });
  }
}
}
