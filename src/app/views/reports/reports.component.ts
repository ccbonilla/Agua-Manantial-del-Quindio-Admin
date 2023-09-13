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

  constructor(private route: ActivatedRoute, private orderService: OrderService) {}
  
  getOrders() {
    this.orderService.get('list').subscribe((orders) => {
      this.orders = orders.filter(
        (order) => order.order_state != 3 && order.order_state != 4
      );
    });
  }
  
  generarChart() {
    // Función para generar colores hexadecimales aleatorios
    function getRandomHexColor(alpha = 0.3) {
      // Generar valores aleatorios para R, G y B en el rango [0, 255]
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      
      const rgbaColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    
      return rgbaColor;
    }
    
    // Datos para el gráfico (puedes actualizar estos datos según tus necesidades)
    const labels = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];
    const data = [12, 19, 3, 5, 2, 3];

    // Genera colores hexadecimales aleatorios para backgroundColor y borderColor
    const backgroundColor = labels.map(() => getRandomHexColor());
    const borderColor = backgroundColor; // El borderColor es el mismo que backgroundColor

    // Configuración del gráfico
    var myChart = new Chart("myChart", {
      type: 'bar',
      data: {
          labels: labels,
          datasets: [{
              label: '# of Votes',
              data: data,
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
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {

      const tipoventas = queryParams['tipoventas'];
      console.log('tipo:', tipoventas);
    });

    this.generarChart();
  
  }

}
