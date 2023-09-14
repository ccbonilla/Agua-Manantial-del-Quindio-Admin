import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Order } from 'src/app/models/order';
import { OrderService } from '../../services/orders/orders.service';
import { Chart, registerables, Colors } from 'chart.js';
import Swal from 'sweetalert2';

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

  constructor(private route: ActivatedRoute, private orderService: OrderService) {}

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

  selectedButton: string = 'button1'; // Establece el botón seleccionado por defecto
  areButtonsVisible: boolean = false; // Controla la visibilidad de los botones

  toggleButtons() {
    this.areButtonsVisible = !this.areButtonsVisible;
  }

  selectButton(buttonId: string) {
    this.selectedButton = buttonId;
    this.toggleButtons(); // Oculta los botones después de seleccionar uno
  }

  ngAfterViewInit() {
    this.getOrdersAndFilter();
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
          this.labels.push(order.order_date + '\n'+order.customer_name);
          this.data.push(order.value);
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

    const backgroundColor = this.labels.map(() => getRandomHexColor());
    const borderColor = backgroundColor;

    // Configuración del gráfico
    const canvas = this.myChartCanvas.nativeElement;

    this.chart = new Chart(canvas, {
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
