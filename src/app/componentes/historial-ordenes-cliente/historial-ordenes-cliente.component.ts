import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../servicios/cliente.service';
import { TokenService } from '../../servicios/token.service';
import { MensajeDTO } from '../../dto/TokenDTOs/MensajeDTO';
import { ItemOrdenDTO } from '../../dto/OrdenDTOs/item-orden-dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historial-ordenes-cliente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial-ordenes-cliente.component.html',
  styleUrls: ['./historial-ordenes-cliente.component.css']
})
export class HistorialOrdenesClienteComponent implements OnInit {
  historialOrdenes: ItemOrdenDTO[] = [];
  errorMensaje: string = '';

  constructor(
    private clienteService: ClienteService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.cargarHistorialOrdenes();
  }

  cargarHistorialOrdenes(): void {
    const usuarioId = this.tokenService.getIDCuenta(); // Obtener el ID del usuario desde el TokenService

    if (usuarioId) {
      this.clienteService.obtenerOrdenesUsuario(usuarioId).subscribe({
        next: (respuesta: MensajeDTO) => {
          if (!respuesta.error) {
            // Formateamos cada orden para manejar la fecha
            this.historialOrdenes = respuesta.respuesta.map((orden: ItemOrdenDTO) => ({
              ...orden,
              fecha: this.formatearFecha(orden.fecha)
            }));
          } else {
            this.errorMensaje = 'Error al cargar el historial de órdenes';
          }
        },
        error: (error) => {
          this.errorMensaje = 'No se pudo obtener el historial de órdenes. Inténtalo más tarde.';
          console.error('Error:', error);
        }
      });
    } else {
      this.errorMensaje = 'No se ha podido obtener el ID del usuario.';
    }
  }

  // Método para formatear la fecha en un formato legible (DD/MM/YYYY HH:mm)
  formatearFecha(fecha: any): string {
    if (Array.isArray(fecha)) {
      const fechaObj = new Date(fecha[0], fecha[1] - 1, fecha[2], fecha[3], fecha[4]);
      const dia = fechaObj.getDate().toString().padStart(2, '0');
      const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
      const año = fechaObj.getFullYear();
      const horas = fechaObj.getHours().toString().padStart(2, '0');
      const minutos = fechaObj.getMinutes().toString().padStart(2, '0');
      return `${dia}/${mes}/${año} ${horas}:${minutos}`;
    }
    return '';
  }
}
