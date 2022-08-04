import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
    .mapa-container {
      width: 100%;
      height: 100%;
    }

    .row{
      background: white;
      position: fixed;
      bottom: 50px;
      left: 50px;
      padding: 10px;
      border-radius: 5px;
      z-index: 99;
      width: 400px;
    }
    `
  ]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapa') divMapa!: ElementRef;
  // Importante el ViewChild para poder crear, hacer referencia a multiples mapas en uns misma pagina
  // y no se dependa del id para hacer referencia a c/u de ellos
  mapa!: mapboxgl.Map;
  zoomLevel: number = 10;
  center: [number, number] = [-70.57636287429864, -33.50186001301022];

  constructor() { 
    console.log('constructor', this.divMapa);
  }
  ngOnDestroy(): void {
    this.mapa.off('zoom', () => {});
    this.mapa.off('zoomend', () => {});
    this.mapa.off('move', () => {});
  }

  ngAfterViewInit(): void {
    // Debe ser en ngAfterViewInit para que de tiempo al onInit de crear el elemento HTML que contendra el mapa 
    console.log('onInit', this.divMapa);
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: this.center, // starting position [lng, lat], en GoogleMaps es al reves
      zoom: this.zoomLevel  // starting zoom, hasta ese valor se deja ver
      //projection: 'mercator' // display the map as a 3D globe
      });
      
      this.mapa.on('style.load', () => {
        //map.setFog({}); // Set the default atmosphere style
      });


      this.mapa.on('zoom', (evento) => {
        console.log('zoom');
        console.log(evento);
        this.zoomLevel = this.mapa.getZoom();  
      });

      this.mapa.on('zoomend', (evento) => {
        if (this.mapa.getZoom() > 18){
          this.mapa.zoomTo(18);
        }  
      });

      this.mapa.on('move', (evento) => {
        const target = evento.target;
        const { lng, lat } = target.getCenter();
        this.center = [ lng, lat ];
      })

    }

    zoomIn(){
      this.mapa.zoomIn();
    }

    zoomOut(){
      this.mapa.zoomOut();
    }

    zoomCambio(valor: string){
      console.log(valor);
      this.mapa.zoomTo(Number(valor));
    }

  }