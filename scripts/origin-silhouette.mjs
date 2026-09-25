/**
 * Силуэт страны для плашки «откуда блюдо» (`widgets/Kitchen`).
 *
 * Natural Earth 110m (public domain), проекция Меркатора, кремовая заливка,
 * вписан в 400×262 — пропорция плашки 154×101 — без полей. Все плашки
 * нарисованы так, чтобы шли одной серией.
 *
 *   curl -LO https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson
 *   node scripts/origin-silhouette.mjs ne_110m_admin_0_countries.geojson France public/images/kitchen/origin-france.webp -10,20,40,52
 *
 * Страна — по полю `ADMIN`. Последний аргумент (необязательный) —
 * рамка `lonMin,lonMax,latMin,latMax`: оставляет только части страны внутри
 * неё. Нужна, когда у страны заморские территории (у Франции — Гвиана).
 */
import fs from "node:fs";
import sharp from "sharp";

const [, , geoPath, name, out, keep] = process.argv;
if (!geoPath || !name || !out) {
  console.error(
    "usage: origin-silhouette.mjs <geojson> <ADMIN name> <out.webp> [lonMin,lonMax,latMin,latMax]",
  );
  process.exit(1);
}

const W = 400;
const H = 262;
const FILL = "#F2F1E0";
const RAD = Math.PI / 180;

const feature = JSON.parse(fs.readFileSync(geoPath, "utf8")).features.find(
  (f) => f.properties.ADMIN === name,
);
if (!feature) throw new Error(`no country "${name}"`);

let polygons =
  feature.geometry.type === "Polygon"
    ? [feature.geometry.coordinates]
    : feature.geometry.coordinates;

// Чукотка за антимеридианом: без переноса Россия растянулась бы на весь мир
polygons = polygons.map((poly) =>
  poly.map((ring) =>
    ring.map(([lon, lat]) => [lon < -150 && name === "Russia" ? lon + 360 : lon, lat]),
  ),
);

if (keep) {
  const [lonMin, lonMax, latMin, latMax] = keep.split(",").map(Number);
  polygons = polygons.filter((poly) =>
    poly[0].every(([lon, lat]) => lon >= lonMin && lon <= lonMax && lat >= latMin && lat <= latMax),
  );
}

const project = ([lon, lat]) => [lon, -Math.log(Math.tan(Math.PI / 4 + (lat * RAD) / 2)) / RAD];

const points = polygons.flat(2).map(project);
const xs = points.map((p) => p[0]);
const ys = points.map((p) => p[1]);
const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
const scale = Math.min(W / (x1 - x0), H / (y1 - y0));
const offsetX = (W - (x1 - x0) * scale) / 2;
const offsetY = (H - (y1 - y0) * scale) / 2;

const path = polygons
  .flatMap((poly) =>
    poly.map(
      (ring) =>
        "M" +
        ring
          .map((point) => {
            const [x, y] = project(point);
            return `${(offsetX + (x - x0) * scale).toFixed(2)},${(offsetY + (y - y0) * scale).toFixed(2)}`;
          })
          .join("L") +
        "Z",
    ),
  )
  .join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><path d="${path}" fill="${FILL}" fill-rule="evenodd"/></svg>`;

sharp(Buffer.from(svg))
  .webp({ lossless: true })
  .toFile(out)
  .then(() => console.log(out));
