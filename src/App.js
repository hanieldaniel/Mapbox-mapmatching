import React, { useEffect } from 'react';
import { useState } from 'react';
import ReactMapGL, { Layer, Source } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import mbxClient from '@mapbox/mapbox-sdk';
import mbxMatch from "@mapbox/mapbox-sdk/services/map-matching";


// mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

function App() {

  const data = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [-117.17283, 32.712041],
        // [-117.17291, 32.712256],
        // [-117.17292, 32.712444],
        // [-117.172922, 32.71257],
        // [-117.172985, 32.7126],
        // [-117.173143, 32.712597],
        [-117.173345, 32.712546]
      ]
    }
  };

  const [viewport, setViewport] = useState({
    width: '100%',
    height: '100%',
    longitude: -117.172985,
    latitude: 32.71257,
    zoom: 19
  });

  const [mapdata, setMapdata] = useState(data)

  const baseClient = mbxClient({ accessToken: process.env.REACT_APP_MAPBOX_TOKEN });
  const mapMatchingClient = mbxMatch(baseClient);

  useEffect(() => {
    async function mapCleanup() {
      await mapMatchingClient.getMatch({
        points: [
          {
            coordinates: [-117.17283, 32.712041]
          },
          // {
          //   coordinates: [-117.17291, 32.712256]
          // },
          // {
          //   coordinates: [-117.17292, 32.712444]
          // },
          // {
          //   coordinates: [-117.172922, 32.71257]
          // },
          // {
          //   coordinates: [-117.172985, 32.7126]
          // },
          // {
          //   coordinates: [-117.173143, 32.712597]
          // },
          {
            coordinates: [-117.173345, 32.712546]
          },
        ],
        tidy: false,
        overview: 'full',
        geometries: 'geojson'
      })
        .send()
        .then(response => {
          const matching = response.body;
          console.log(matching);
          setMapdata({
            type: 'Feature',
            geometry: matching.matchings[0].geometry
          })
        })
    }
    mapCleanup();
  }, [])


  return (
    <div className="mapContainer">
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle='mapbox://styles/mapbox/light-v9'
        onViewportChange={nextViewport => setViewport(nextViewport)}
      >
        <Source id='route' type='geojson' data={mapdata}>
          <Layer
            id='route'
            type='line'
            source='route'
            layout={{
              'line-join': 'round',
              'line-cap': 'round'
            }}
            paint={{
              'line-color': '#0f0',
              'line-width': 4,
              'line-opacity': .2
            }}
          />
        </Source>
        <Source id='route1' type='geojson' data={data}>
          <Layer
            id='route1'
            type='line'
            source='route'
            layout={{
              'line-join': 'round',
              'line-cap': 'round'
            }}
            paint={{
              'line-color': '#ff0000',
              'line-width': 4,
              'line-opacity': .2
            }}
          />
        </Source>
      </ReactMapGL>
    </div>
  );
}

export default App;
