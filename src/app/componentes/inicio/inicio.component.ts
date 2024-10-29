import { Component } from '@angular/core';
import { PublicoService } from '../../servicios/publico.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'] // Cambié `styleUrl` a `styleUrls`
})
export class InicioComponent {
  public eventos: any[]; // Declaración de la variable `eventos`

  constructor(private publicoService: PublicoService) {
    this.eventos = [];
    this.obtenerEventos();
  }

  public obtenerEventos() {
    this.publicoService.listarEventos(0).subscribe({
      next: (data) => {
        console.log(data.respuesta); // Verificar el contenido de los datos
        this.eventos = data.respuesta;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}