/* global L */

(function () {
  const PADDING = 50;
  const defaultZoom = 15;

  function parsedParam (stringParams, paramName, isCoordinate) {
    if (!stringParams) {
      return null;
    }

    for (const key in stringParams) {
      const param = stringParams[key];
      if (param.indexOf(paramName + '=') === 0) {
        const value = param.split('=')[1];
        if (!isCoordinate) {
          return value;
        }
        return areCoordinatesValid(value) ? value.split(',') : null;
      }
    }
    return null;
  };

  function areCoordinatesValid (str) {
    // eslint-disable-next-line no-useless-escape
    const regexExp = /^((\-?|\+?)?\d+(\.\d+)?),\s*((\-?|\+?)?\d+(\.\d+)?)$/gi;
    return regexExp.test(str);
  };

  function getParams () {
    const query = window.location.search.substring(1);
    const stringParams = query.split('&');

    return {
      points: {
        target: parsedParam(stringParams, 'target', true),
        position: parsedParam(stringParams, 'position', true),
        pilot: parsedParam(stringParams, 'pilot', true)
      },
      zoom: parsedParam(stringParams, 'zoom', false)
    };
  };

  function initMap () {
    const config = {};

    const map = L.map('map', config);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    L.control.scale({
      imperial: false
    }).addTo(map);
    return map;
  };

  function prepareMarkerIcon (object) {
    const objectColor = {
      target: 'red',
      position: 'green',
      pilot: 'blue',
      default: '#2E85CB'
    };

    const color = objectColor[object] || objectColor.default;
    const svgTemplate = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="marker">' +
      '<path fill-opacity=".25" d="M16 32s1.427-9.585 3.761-12.025c4.595-4.805 8.685-.99 8.685-.99s4.044 3.964-.526 8.743C25.514 30.245 16 32 16 32z"/>' +
      '<path stroke="#fff" fill="' + color + '" d="M15.938 32S6 17.938 6 11.938C6 .125 15.938 0 15.938 0S26 .125 26 11.875C26 18.062 15.938 32 15.938 32zM16 6a4 4 0 100 8 4 4 0 000-8z"/>' +
    '</svg>';

    const icon = L.divIcon({
      className: 'marker',
      html: svgTemplate,
      iconSize: [40, 40],
      iconAnchor: [12, 24],
      popupAnchor: [7, -16]
    });

    return icon;
  };

  function prepareFeatureGroups (points) {
    const featureGroups = Object.keys(points)
      .filter(function (key) {
        return !!points[key];
      })
      .map(function (key) {
        const point = points[key];
        const lat = point[0];
        const lng = point[1];

        const title = key + '<br/>' + lat + ', ' + lng;
        const marker = L.marker([lat, lng], {
          icon: prepareMarkerIcon(key)
        });
        if (title) {
          marker.bindPopup(title,
            {
              closeButton: false,
              autoClose: false,
              className: 'compact-popup'
            });

          marker.on('add', function (event) {
            event.target.openPopup();
          });
        }

        return marker;
      });

    return featureGroups;
  };

  function addFeatureGroupsToMap (map, featureGroups) {
    featureGroups.forEach(function (group) {
      group.addTo(map);
    });
  };

  function fitBounds (map, featureGroups, parsedZoom) {
    // eslint-disable-next-line new-cap
    const group = new L.featureGroup(featureGroups);
    map.fitBounds(group.getBounds(), {
      padding: [PADDING, PADDING]
    });

    const zoom = (!isNaN(parsedZoom) && parsedZoom > 0) ? parsedZoom : defaultZoom;
    map.setZoom(zoom);
  };

  function renderNoDataMap (map) {
    const legend = L.control({ position: 'bottomleft' });

    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'no-data-description');
      L.DomEvent.disableClickPropagation(div);
      const text = '<h4>Недостатньо даних</h4>' +
        "<div class='description-block'>" +
          'Параметри:<br/>' +
          '<i>target=lat,lng<br/>' +
          'position=lat,lng<br/>' +
          'pilot=lat,lng</i><br/>' +
        '</div>' +
        "<div class='description-block'>" +
          'Приклад:<br/>' +
          '<i>index.html?target=49.566115,25.576170&position=49.551971,25.593743&pilot=49.554738,25.607933</i>' +
        '</div>';

      div.insertAdjacentHTML('beforeend', text);
      return div;
    };

    legend.addTo(map);

    map.setView([49.264822, 32.787117], 7);
  };

  function renderMap (params) {
    const points = params.points;
    const map = initMap();
    const featureGroups = prepareFeatureGroups(points);

    if (featureGroups.length > 0) {
      addFeatureGroupsToMap(map, featureGroups);
      fitBounds(map, featureGroups, params.zoom);
    } else {
      renderNoDataMap(map);
    }
  };

  window.onload = function (event) {
    const params = getParams();
    console.log(params);
    renderMap(params);
  };
})();
