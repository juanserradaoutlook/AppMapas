import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorColor {
  color: string;
  marker: mapboxgl.Marker;
  centro?: [ number, number ]
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
    .mapa-container {
      width: 100%;
      height: 100%;
    }

    .list-group{
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 99;
    }

    li{
      cursor: pointer;
    }

    /* .row{
      background: white;
      position: fixed;
      bottom: 50px;
      left: 50px;
      padding: 10px;
      border-radius: 5px;
      z-index: 99;
      width: 400px;
    } */
    `
  ]
})

export class MarcadoresComponent implements OnInit {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 15;
  center: [number, number] = [-70.57636287429864, -33.50186001301022];
  
  // Arreglo de marcadores
  marcadores: MarcadorColor[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: this.center, // starting position [lng, lat], en GoogleMaps es al reves
      zoom: this.zoomLevel  // starting zoom, hasta ese valor se deja ver
      //projection: 'mercator' // display the map as a 3D globe
      });

      this.leerLocalStorage();

      // En esta clase de marcadores, hemos creado un marcador de manera
      // Estatica, es un ejemplo simple:

      // Ejemplo 1: Funciona si no lo creamos como una variable, 
      // new mapboxgl.Marker()
      //   .setLngLat( this.center )
      //   .addTo(this.mapa);

      // pero lo hemos creado con esa variable llamada marker para
      // poder hacer referencias luego a esa marca en el mapa
      // por si le debemos agregar un evento o un listener

      // Ademas, hemos creado un elemento html para insertarlo dentro
      // del mapa como una marca

      // const markerHtml: HTMLElement = document.createElement('div');
      // markerHtml.innerHTML = 'Hola Mundo';

      // const marker = new mapboxgl.Marker({
      //   element: markerHtml
      // })
      // .setLngLat( this.center )
      // .addTo(this.mapa);


      // Ahora este Ejemplo 2 es para crear marcadores dinamicos

    }

    irMarcador(marker: mapboxgl.Marker){
      this.mapa.flyTo({
        center: marker.getLngLat()
      })
    }

    agregarMarcador(){

      const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));

      const nuevoMarcador = new mapboxgl.Marker({
        draggable: true,
        color
      })
        .setLngLat( this.center )
        .addTo( this.mapa );

        this.marcadores.push({
          color,
          marker: nuevoMarcador
        });

        this.guardarMarcadorLocalStorage();

        nuevoMarcador.on('dragend', () => {
          this.guardarMarcadorLocalStorage();
        });
    }

    guardarMarcadorLocalStorage(){
      const lngLatArr: MarcadorColor[] = [];
      this.marcadores.forEach( m => {
          const color = m.color;
          const { lng, lat } = m.marker!.getLngLat();

          lngLatArr.push({
            color: color,
            centro: [lng, lat],
            marker: new mapboxgl.Marker
          });
      });
      localStorage.setItem('marcadores', JSON.stringify(lngLatArr));      
    }

    leerLocalStorage(){
      if (!localStorage.getItem('marcadores')){
        return;
      }
      const lngLatArr: MarcadorColor[] = JSON.parse(localStorage.getItem('marcadores')!);

      lngLatArr.forEach( m => {
        const newMarker = new mapboxgl.Marker({
          color: m.color,
          draggable: true
        })
        .setLngLat(m.centro!)
        .addTo(this.mapa);

        this.marcadores.push({
          marker: newMarker,
          color: m.color
        });

        newMarker.on('dragend', () => {
          this.guardarMarcadorLocalStorage();
        });
      });
    }


    borrarMarcador(i: number){
      this.marcadores[i].marker.remove();
      this.marcadores.splice(i, 1);
      this.guardarMarcadorLocalStorage();
    }

}
