const geoip = require("geoip-lite");
const path = require("path");
const fs = require("fs");

const config = require("../config");

const DB_PATH = path.join(__dirname, "geo.db");

const LOCALES = {
  US: "en",
  BR: "pt-BR",
};

const UNITS = {
  US: "miles",
  BR: "km",
};

const FACTORS = {
  km: 6371,
  m: 6371 * 1000,
  miles: 6371 * 0.621371,
};

class Geo {
  constructor() {
    const lines = fs.readFileSync(DB_PATH, "utf8").split(/\n/);

    const cities = [];

    for (var i = 0; i < lines.length - 1; i++) {
      const line = lines[i];
      const cols = line.split("|");

      const country = cols[1];

      cities.push({
        city: cols[0],
        country: cols[1],
        latitude: parseFloat(cols[2]),
        longitude: parseFloat(cols[3]),
        locale: LOCALES[country] || "en",
        unit: UNITS[country] || "miles",
      });
    }

    this.data = cities.sort((a, b) => {
      const diff = a.latitude - b.latitude;

      if (diff !== 0) return diff;

      return a.longitude - b.longitude;
    });

    this.locales = Object.entries(LOCALES).map((item) => {
      return item[1];
    });

    this.units = Object.entries(UNITS).map((item) => {
      return item[1];
    });

    this.factors = FACTORS;

    Object.freeze(this.data);
    Object.freeze(this.locales);
    Object.freeze(this.units);
    Object.freeze(this.factors);
  }

  reverse(lat, lng, keepCoordinates = true) {
    function vectorDistance(dx, dy) {
      return Math.sqrt(dx * dx + dy * dy);
    }

    function locationDistance(location1, location2) {
      const dx = location1.latitude - location2.latitude;
      const dy = location1.longitude - location2.longitude;

      return vectorDistance(dx, dy);
    }

    const info = this.data.reduce((prev, curr) => {
      const prevDistance = locationDistance(
        {
          latitude: lat,
          longitude: lng,
        },
        prev
      );

      const currDistance = locationDistance(
        {
          latitude: lat,
          longitude: lng,
        },
        curr
      );

      return prevDistance < currDistance ? prev : curr;
    });

    if (keepCoordinates) {
      info.latitude = lat;
      info.longitude = lng;
    }

    return info;
  }

  random(latitude, longitude, radius, unit = "m") {
    switch (unit) {
      case "km":
        radius = this.kmToMeters(radius);
        break;
      case "miles":
        radius = this.milesToMeters(radius);
        break;
    }

    const x0 = longitude;
    const y0 = latitude;

    const rd = radius / 111300;

    const u = Math.random();
    const v = Math.random();

    const w = rd * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const x = w * Math.cos(t);
    const y = w * Math.sin(t);

    const xp = x / Math.cos(y0);

    const lat = y + y0;
    const lgn = xp + x0;

    return this.reverse(lat, lgn);
  }

  distance(start, end, unit = "miles") {
    const R = this.factors[unit];

    const dLat = ((end.latitude - start.latitude) * Math.PI) / 180;
    const dLon = ((end.longitude - start.longitude) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((start.latitude * Math.PI) / 180) *
        Math.cos((end.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.asin(Math.sqrt(a));
    const d = R * c;

    return d;
  }

  lookup(ip) {
    const data = geoip.lookup(ip);

    if (data) {
      return reverse(data.ll[0], data.ll[1]);
    }

    if (!config.isDevelopment) {
      throw new GeoError();
    } else {
      const randId = this.data[Math.floor(Math.random() * this.data.length)];

      const info = this.data[randId];

      info.ip = ip;

      return info;
    }
  }

  milesToMeters(value) {
    return value * 1609.34;
  }

  milesToKm(value) {
    return this.metersToKm(this.milesToM(value));
  }

  metersToKm(value) {
    return value / 1000;
  }

  metersToMiles(value) {
    return value * 0.000621371;
  }

  kmToMiles(value) {
    return value * 6371 * 0.621371;
  }

  kmToMeters(value) {
    return value * 1000;
  }
}

module.exports = new Geo();
