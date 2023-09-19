import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Order } from 'src/app/models/order';
import { OrderService } from '../../services/orders/orders.service';
import { Chart, registerables, Colors } from 'chart.js';
import Swal from 'sweetalert2';
import { MatDialog, DialogPosition } from '@angular/material/dialog';
import { DialogConfigChartComponent } from './dialog-conf-chart/dialog-config-chart.component';

Chart.register(...registerables);
Chart.register(Colors);

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit, AfterViewInit {
  
  @ViewChild('myChart', { static: true }) myChartCanvas!: ElementRef;

  chart : any;
  orders: Order[] = [];
  public startDate: Date = new Date();
  public endDate: Date = new Date();
  data: number[] = [];
  labels: string[] = [];
  isLoading: boolean = true;
  isChartJsInitialized: boolean = false;
  
  setUpChart: any = {
    fechaFinal: '',
    fechaInicial: '',
    pedido: false,
    cliente: false,
    fecha: true,
  };

  constructor(private route: ActivatedRoute, private orderService: OrderService, public dialog: MatDialog) {}

  
  openDialogNew() {
    console.log('opne dialog2');
    const dialogRef = this.dialog.open(DialogConfigChartComponent, {
      height: '420px',
      width: '630px',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        console.log(res);
        this.setUpChart = res;
        this.addSetUpChart();
      } else {
        console.log('res es null o vacío');
      }
    });
  }

  //openDialogNew() {
  //  console.log('opne dialog');
  //  const position: DialogPosition = {
  //    left: '30%',
  //    top: '-600px',
  //  };
  //  const dialogRef = this.dialog.open(DialogConfigChartComponent, {
  //    height: '400px',
  //    width: '630px',
  //    position: position,
  //  });
  //  dialogRef.afterClosed().subscribe((res) => {
  //    if (res) {
  //      console.log(res);
  //      this.setUpChart = res;
  //      this.addSetUpChart();
  //    } else {
  //      console.log('res es null o vacío');
  //    }
  //  });
  //}

  addSetUpChart() {

    this.isLoading = true;
    this.orders = [];
    this.labels= [];
    this.data = [];

    this.startDate = new Date(this.setUpChart.fechaInicial);
    this.endDate =  new Date(this.setUpChart.fechaFinal);

    this.getOrdersAndFilter(); // Vuelve a consultar los order y generar el gráfico
  }

  public changeChartType(newChartType: string): void {
    this.isLoading = true;

    this.orders = [];
    this.labels= [];
    this.data = [];

    if (newChartType === 'dia') {
      this.startDate = new Date();
      this.endDate = new Date();
    } else if (newChartType === 'semana') {
      this.getWeekRange();
    } else if (newChartType === 'mes') {
      this.getMonthRange();
    }

    this.getOrdersAndFilter(); // Vuelve a consultar los order y generar el gráfico
  }

  ngAfterViewInit() {
    this.getOrdersAndFilter();
  }
  
  getLabelsChart(order: any): any {

    var labelChart = '';

    if(this.setUpChart.pedido){
      labelChart += 'pedido:'+order.order_id;
    }
    if(this.setUpChart.fecha){
      labelChart += ' '+order.order_date;
    }
    if(this.setUpChart.cliente){
      labelChart += ' '+order.customer_name;
    }
    return labelChart;
  }

  getOrdersAndFilter() {

    console.log('start date '+this.startDate);
    const stringStartDate = this.startDate.toISOString().slice(0, 10);
    console.log(stringStartDate);
    const stringEndDate = this.endDate.toISOString().slice(0, 10);
    console.log(stringEndDate);

    this.orderService.get('list').subscribe((orders) => {

      orders.forEach((order) => {
        if( stringStartDate <= order.order_date && stringEndDate >= order.order_date ){
          console.log('match '+JSON.stringify(order));
          this.orders.push(order); 
          this.data.push(order.value);
          //labels
          this.labels.push(this.getLabelsChart(order));
        }
      });
      this.generarChart();
    });
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

    this.startDate = firstDayOfMonth;
    this.endDate = lastDayOfMonth;

    return `Desde ${firstDayFormatted} hasta ${lastDayFormatted}`;
  }

  generarChart() {
    //condicional permite conocer si es actualizacion o se creara el canvas por primera vez
    if (this.isChartJsInitialized) {
      this.chart.data.labels = this.labels;
      this.chart.data.datasets[0].data = this.data;
      this.chart.update();
      this.isLoading = false;
      return;
    }
    this.isChartJsInitialized = true;

    function getRandomHexColor(alpha = 0.3) {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      
      const rgbaColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    
      return rgbaColor;
    }

    if (this.labels && this.labels.length > 0) {
      var backgroundColor = this.labels.map(() => getRandomHexColor());
      var borderColor = backgroundColor;
    } else {
      backgroundColor = ['rgba(54, 162, 235, 0.2)'];
      borderColor = backgroundColor;
    }
    // Configuración del gráfico
    const canvas = this.myChartCanvas.nativeElement;

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
          labels: this.labels,
          datasets: [{
              label: 'ventas del día',
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
  
  downloadAsPDF() {
    // Captura el elemento del gráfico como una imagen
    html2canvas(this.myChartCanvas.nativeElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth - 20, pdfHeight - 20);
      pdf.save('grafico.pdf');

      Swal.fire('Exitoso', 'Archivo descargado', 'success');
    });
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {

      const tipoventas = queryParams['tipoventas'];
      console.log('tipo:', tipoventas);
    });
    
  }
}

