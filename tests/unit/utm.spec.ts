import { faker } from "@faker-js/faker";
import { CodeGrid } from "../../src";
import { gridCodeCellsValidation } from "../../src/validations";
import * as gridCodeCells from './helpers/gridCodeCells.json';
import exp from "constants";

const gridCodeCellsData = gridCodeCellsValidation.parse(gridCodeCells);

let grid: CodeGrid;

beforeEach(() => {
  grid = new CodeGrid(gridCodeCellsData);
});

describe('UTM coordinates #UTM', () => {
  // TODO: should it be tested if imported from other lib? perhaps it should
  describe('create UTM coordinate #constructor', () => {
    it('should create a UTM coordinate', () => {
      const zone = faker.number.int({ min: 1, max: 60 });
      const hemisphere = faker.helpers.arrayElement(['N', 'S']);
      const easting = faker.number.float({ min: 170000, max: 830000 });
      const northing = hemisphere === 'N' ? faker.number.float({ max: 9320000 }) : faker.number.float({ min: 1120000, max: 10000000 });

      expect(() => new grid.UTM(zone, hemisphere === 'N' ? 'N' : 'S', easting, northing));
    });
    it('should throw an error if the longitude of the UTM coordinate is outside of utm projection bbox', () => {
      const zone = 36;
      const hemisphere = 'N';
      const easting = 795000.0;
      const northing = 3525000.0;

      expect(() => new grid.UTM(zone, hemisphere, easting, northing)).toThrow('Longitude should be between [30, 36)');
    });
    it.only('should throw an error if the latitude of the UTM coordinate is outside of utm projection bbox', () => {
      const zone = 36;
      const hemisphere = 'N';
      const easting = 500000.0;
      const northing = 9450000.0;

      expect(() => new grid.UTM(zone, hemisphere, easting, northing)).toThrow('latitude should be between [-80, 84]');
    });
  });
  describe('get hemisphere #getHemisphere', () => {
    it('should get the hemisphere of the UTM coord', () => {
      const zone = faker.number.int({ min: 1, max: 60 });
      const hemisphere = faker.helpers.arrayElement(['N', 'S']);
      const easting = faker.number.float({ min: 170000, max: 830000 });
      const northing = hemisphere === 'N' ? faker.number.float({ max: 9320000 }) : faker.number.float({ min: 1120000, max: 10000000 });
      const utmCoord = new grid.UTM(zone, hemisphere === 'N' ? 'N' : 'S', easting, northing);

      const getHemisphere = utmCoord.getHemisphere();

      expect(getHemisphere).toStrictEqual(hemisphere);
    });
  });
  describe('get zone #getZone', () => {
    it('should get the zone of the UTM coord', () => {
      const zone = faker.number.int({ min: 1, max: 60 });
      const hemisphere = faker.helpers.arrayElement(['N', 'S']);
      const easting = faker.number.float({ min: 170000, max: 830000 });
      const northing = hemisphere === 'N' ? faker.number.float({ max: 9320000 }) : faker.number.float({ min: 1120000, max: 10000000 });
      const utmCoord = new grid.UTM(zone, hemisphere === 'N' ? 'N' : 'S', easting, northing);

      const getZone = utmCoord.getZone();

      expect(getZone).toStrictEqual(zone);
    });
  });
  describe('get easting #getEasting', () => {
    it('should get the easting of the UTM coord', () => {
      const zone = faker.number.int({ min: 1, max: 60 });
      const hemisphere = faker.helpers.arrayElement(['N', 'S']);
      const easting = faker.number.float({ min: 170000, max: 830000 });
      const northing = hemisphere === 'N' ? faker.number.float({ max: 9320000 }) : faker.number.float({ min: 1120000, max: 10000000 });
      const utmCoord = new grid.UTM(zone, hemisphere === 'N' ? 'N' : 'S', easting, northing);

      const getEasting = utmCoord.getEasting();

      expect(getEasting).toStrictEqual(getEasting);
    });
  });
  describe('get northing #getNorthing', () => {
    it('should get the northing of the UTM coord', () => {
      const zone = faker.number.int({ min: 1, max: 60 });
      const hemisphere = faker.helpers.arrayElement(['N', 'S']);
      const easting = faker.number.float({ min: 170000, max: 830000 });
      const northing = hemisphere === 'N' ? faker.number.float({ max: 9320000 }) : faker.number.float({ min: 1120000, max: 10000000 });
      const utmCoord = new grid.UTM(zone, hemisphere === 'N' ? 'N' : 'S', easting, northing);

      const getNorthing = utmCoord.getNorthing();

      expect(getNorthing).toStrictEqual(getNorthing);
    });
  });
  describe('transform a UTM coordinate to grid code coordinate #toGridCode', () => {
    it('should transform a UTM coordinate within the grid code zone, containing a non-ascii char', () => {
      const expectedCoord = new grid.GridCode('אבג', ['55', '00', '00']);
      const zone = 36;
      const hemisphere = 'N';
      const easting = 775000.0;
      const northing = 3525000.0;
      const utmCoord = new grid.UTM(zone, hemisphere, easting, northing);

      const gridCodeCoord = utmCoord.toGridCode();

      expect(gridCodeCoord).toStrictEqual(expectedCoord);
    });
    it('should transform a UTM coordinate within the grid code zone, in the southern hemisphere, containing a non-ascii char', () => {
      const expectedCoord = new grid.GridCode('אבי', ['55', '00', '00']);
      const zone = 37;
      const hemisphere = 'S';
      const easting = 165000.0;
      const northing = 9885000.0;
      const utmCoord = new grid.UTM(zone, hemisphere, easting, northing);

      const gridCodeCoord = utmCoord.toGridCode();

      expect(gridCodeCoord).toStrictEqual(expectedCoord);
    });
    it.todo('should throw an error if the UTM coordinate is outside the grid code zone');
    it.todo('should throw an error if the transformed coordinate is invalid');
  });
  describe('transform a UTM coordinate to geodetic coordinate #toGeodetic', () => {
    it.todo('should transform a UTM coordinate within the grid code zone');
    it.todo('should throw an error if the UTM coordinate is invalid');
    it.todo('should throw an error if the UTM coordinate is outside the grid code zone');
    it.todo('should throw an error if the transformed coordinate is invalid');
  });
});