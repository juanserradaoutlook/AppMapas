import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-mini-mapa',
  templateUrl: './mini-mapa.component.html',
  styles: [
    `
    div{
      width: 100%;
        height: 150px;
        margin: 0px;
    }
    `
  ]
})
export class MiniMapaComponent implements AfterViewInit {

  @Input() lngLat: [number, number] = [0, 0];
  @ViewChild('mapa') divMapa!: ElementRef;

  constructor() { }

  ngAfterViewInit(): void {
    const mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: this.lngLat, // starting position [lng, lat], en GoogleMaps es al reves
      zoom: 15,
      interactive: false  // starting zoom, hasta ese valor se deja ver
      //projection: 'mercator' // display the map as a 3D globe
      });

      new mapboxgl.Marker()
        .setLngLat(this.lngLat)
        .addTo(mapa);
  }

}
