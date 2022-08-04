import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.component.html',
  styles: [
    `
    #mapa {
      width: 100%;
      height: 100%;
    }
    `
  ]
})
export class FullScreenComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    
    const map = new mapboxgl.Map({
    container: 'mapa', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-70.57636287429864, -33.50186001301022], // starting position [lng, lat], en GoogleMaps es al reves
    zoom: 18  // starting zoom, hasta ese valor se deja ver
    //projection: 'mercator' // display the map as a 3D globe
    });
    
    map.on('style.load', () => {
      //map.setFog({}); // Set the default atmosphere style
    });
  }

}
