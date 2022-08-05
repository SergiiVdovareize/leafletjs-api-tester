(() => {
const PADDING = 50
const defaultZoom = 14;

const getParamCoordinates = (urlParams, paramName) => {
  const value = urlParams.get(paramName)
  return areCoordinatesValid(value) ? value.split(',') : null
}

const areCoordinatesValid = (str) => {
  const regexExp = /^((\-?|\+?)?\d+(\.\d+)?),\s*((\-?|\+?)?\d+(\.\d+)?)$/gi;
  return regexExp.test(str);
}

const getParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    points : {
      target: getParamCoordinates(urlParams, 'target'),
      position: getParamCoordinates(urlParams, 'position'),
      pilot: getParamCoordinates(urlParams, 'pilot')
    }
  }
}

const initMap = () => {
  const config = {
  };
  
  map = L.map("map", config);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
  return map
}

const prepareMarkerIcon = (object) => {
  const objectColor = {
    target: 'red',
    position: 'green',
    pilot: 'blue',
    default: '#2E85CB',
  }

  const color = objectColor[object] || objectColor.default
  const svgTemplate = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="marker">
      <path fill-opacity=".25" d="M16 32s1.427-9.585 3.761-12.025c4.595-4.805 8.685-.99 8.685-.99s4.044 3.964-.526 8.743C25.514 30.245 16 32 16 32z"/>
      <path stroke="#fff" fill="${color}" d="M15.938 32S6 17.938 6 11.938C6 .125 15.938 0 15.938 0S26 .125 26 11.875C26 18.062 15.938 32 15.938 32zM16 6a4 4 0 100 8 4 4 0 000-8z"/>
    </svg>`;

  const icon = L.divIcon({
    className: "marker",
    html: svgTemplate,
    iconSize: [40, 40],
    iconAnchor: [12, 24],
    popupAnchor: [7, -16],
  });

  return icon;
}

const prepareFeatureGroups = (points) => {
  const featureGroups = Object.keys(points)
    .filter(key => !!points[key])
    .map(key => {
      const point = points[key];
      const [lat, lng] = point;
      const title = `${key}<br/> ${lat}, ${lng}`
      const marker = L.marker([lat, lng], {
        icon: prepareMarkerIcon(key)
      })
      if (title) {
        marker.bindPopup(title, 
          { 
            closeButton: false,
            autoClose: false,
            className: 'compact-popup'
          })

        marker.on("add", function (event) {
          event.target.openPopup();
        });
      }

    return marker
  })

  return featureGroups
}

const addFeatureGroupsToMap = (map, featureGroups) => {
  featureGroups.forEach(group => {
    group.addTo(map)
  })
}

const fitBounds = (map, featureGroups) => {
  const group = new L.featureGroup(featureGroups);
  map.fitBounds(group.getBounds(), {
    padding: [PADDING, PADDING],
  });
  map.setZoom(defaultZoom);
}

const renderNoDataMap = (map) => {
  const legend = L.control({ position: "bottomleft" });

  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "no-data-description");
    L.DomEvent.disableClickPropagation(div);
    const text = `
    <h4>Недостатньо даних</h4>
    <div class='description-block'>
      Параметри:<br/>
      <i>target=lat,lng<br/>
      position=lat,lng<br/>
      pilot=lat,lng</i><br/>
    </div>
    <div class='description-block'>
      Приклад:<br/>
      <i>index.html?target=49.566115,25.576170&position=49.551971,25.593743&pilot=49.554738,25.607933</i>
    </div>
    `
      
    div.insertAdjacentHTML("beforeend", text);
    return div;
  };

  legend.addTo(map);

  map.setView([49.264822, 32.787117], 6);
}

const renderMap = ({ points = {} }) => {
  const map = initMap()
  const featureGroups = prepareFeatureGroups(points)
  if (featureGroups.length > 0) {
    addFeatureGroupsToMap(map, featureGroups)
    fitBounds(map, featureGroups)
  } else {
    renderNoDataMap(map)
  }
}

window.onload = (event) => {
  const params = getParams()
  renderMap(params)
}
})()
