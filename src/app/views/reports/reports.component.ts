import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/models/order';
import { OrderService } from '../../services/orders/orders.service';
import { Chart, registerables, Colors } from 'chart.js';
Chart.register(...registerables);
Chart.register(Colors);

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  chart : any;
  orders: Order[] = [];
  public startDate: Date = new Date();
  public endDate: Date = new Date();
  data: number[] = [];
  labels: string[] = [];
  isLoading: boolean = true;
  public currentChartType = 'bar';

  constructor(private route: ActivatedRoute, private orderService: OrderService) {}

  public changeChartType(newChartType: string): void {
    this.currentChartType = newChartType;
    this.generarChart(); // Vuelve a generar el gráfico con el nuevo tipo
  }

  actualizarChart() {
    // Resto del código de configuración del gráfico
  
    const chartType = this.currentChartType;
  
    var myChart;

    //this.getOrders();
  
    this.isLoading = false;
  }
  
  getOrders() {

    console.log('start date '+this.startDate);
    const stringStartDate = this.startDate.toISOString().slice(0, 10);
    console.log(stringStartDate);
    const stringEndDate = this.endDate.toISOString().slice(0, 10);
    console.log(stringEndDate);

    this.orderService.get('list').subscribe((orders) => {

      orders.forEach((order) => {
        if(order.order_date <= stringStartDate && order.order_date >= stringStartDate){
          console.log('match '+JSON.stringify(order));
          this.orders.push(order); 
          this.labels.push(order.order_date);
          this.data.push(order.value);
        }
      });
      this.generarChart();
    });
    //const semana = this.getWeekRange();
    //console.log(semana);
  }

  getWeekRange() {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const firstDayOfWeek = new Date(currentDate);
    const lastDayOfWeek = new Date(currentDate);

    firstDayOfWeek.setDate(currentDate.getDate() - currentDay + 1);

    lastDayOfWeek.setDate(currentDate.getDate() + (7 - currentDay));

    const firstDayFormatted = firstDayOfWeek;
    const lastDayFormatted = lastDayOfWeek;
    console.log('fin get week '+ `Desde ${firstDayFormatted} hasta ${lastDayFormatted}`);

    this.startDate = firstDayOfWeek;
    this.endDate = lastDayOfWeek;

    return `Desde ${firstDayFormatted} hasta ${lastDayFormatted}`;
  }

  getMonthRange() {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const firstDayFormatted = firstDayOfMonth;
    const lastDayFormatted = lastDayOfMonth;

    return `Desde ${firstDayFormatted} hasta ${lastDayFormatted}`;
  }
  
  generarChart() {
    function getRandomHexColor(alpha = 0.3) {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      
      const rgbaColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    
      return rgbaColor;
    }

    const backgroundColor = this.labels.map(() => getRandomHexColor());
    const borderColor = backgroundColor;

    // Configuración del gráfico
    var myChart = new Chart("myChart", {
      type: 'bar',
      data: {
          labels: this.labels,
          datasets: [{
              label: 'ventas de día',
              data: this.data,
              backgroundColor: backgroundColor,
              borderColor: borderColor,
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
    });
    this.isLoading = false;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {

      const tipoventas = queryParams['tipoventas'];
      console.log('tipo:', tipoventas);
    });
    this.getOrders();
  }
}
