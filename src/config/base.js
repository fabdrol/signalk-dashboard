// Settings configured here will be merged into the final config object.
export default {
  name: 'Volare',
  host: 'signalk.local',
  port: 3000,
  language: 'en',

  labels: {
    en: {
      speedTitle: 'Speed',
      stw: 'through water',
      sog: 'over ground',
      cogTitle: 'Course over ground',
      cogTrue: 'true',
      cogMag: 'magnetic',
      depthTitle: 'Depth',
      meter: 'meter',
      positionTitle: 'Longitude/latitude',
      local: 'local',
      north: 'N',
      south: 'S',
      east: 'E',
      west: 'W',
    },

    nl: {
      speedTitle: 'Snelheid',
      stw: 'door het water',
      sog: 'over de grond',
      cogTitle: 'Koers over de grond',
      cogTrue: 'waar',
      cogMag: 'magnetisch',
      depthTitle: 'Diepgang',
      meter: 'meter',
      positionTitle: 'Longitude/latitude',
      local: 'lokale tijd',
      north: 'N',
      south: 'Z',
      east: 'O',
      west: 'W',
    }
  }
};
