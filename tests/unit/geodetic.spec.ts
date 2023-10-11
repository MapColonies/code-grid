import { faker } from '@faker-js/faker';
import { CodeGrid } from '../../src/index';
import { gridCodeCellsValidation } from '../../src/validations';
import * as gridCodeCells from './helpers/gridCodeCells.json';

const gridCodeCellsData = gridCodeCellsValidation.parse(gridCodeCells);

let grid: CodeGrid;

beforeEach(() => {
  grid = new CodeGrid(gridCodeCellsData);
});

describe('geodetic coordinates #geodetic', () => {
  // TODO: should it be tested if imported from other lib? perhaps it should
  describe('create geodetic coordinate #constructor', () => {
    it('should create a geodetic coordinate', () => {
      const longitude = faker.location.longitude();
      const latitude = faker.location.latitude();
      const coordinate = {
        longitude,
        latitude
      };

      expect(() => new grid.Geodetic(coordinate)).not.toThrow();
    });
    it('should throw an error if the longitude is out of range', () => {
      const expectedError = 'longitude should be between [-180, 180)';
      const badLongitude = faker.helpers.arrayElement([faker.location.longitude({ min: 180, max: 540 }), faker.location.longitude({ min: -540, max: -180 })]);
      const latitude = faker.location.latitude();
      const badCoordinate = {
        longitude: badLongitude,
        latitude
      };

      expect(() => new grid.Geodetic(badCoordinate)).toThrow(expectedError);
    });
    it('should throw an error if the latitude is out of range', () => {
      const expectedError = 'latitude should be between [-90, 90)';
      const longitude = faker.location.longitude();
      const badLatitude = faker.helpers.arrayElement([faker.location.latitude({ min: 90, max: 360 }), faker.location.latitude({ min: -360, max: -90 })]);
      const badCoordinate = {
        longitude,
        latitude: badLatitude
      };

      expect(() => new grid.Geodetic(badCoordinate)).toThrow(expectedError);
    });
  });
  describe('get longitude #getLongitude', () => {
    it('should get the longitude of the geodetic coord', () => {
      const longitude = faker.location.longitude();
      const latitude = faker.location.latitude();
      const coordinate = {
        longitude,
        latitude
      };

      const geodetic = new grid.Geodetic(coordinate);
      const getLongitude = geodetic.getLongitude();

      expect(getLongitude).toBe(longitude);
    });
  });
  describe('get latitude #getLatitude', () => {
    it('should get the latitude of the geodetic coord', () => {
      const longitude = faker.location.longitude();
      const latitude = faker.location.latitude();
      const coordinate = {
        longitude,
        latitude
      };

      const geodetic = new grid.Geodetic(coordinate);
      const getLatitude = geodetic.getLatitude();

      expect(getLatitude).toBe(latitude);
    });
  });
  describe('transform a geodetic coordinate to grid code coordinate #toGridCodeCoord', () => {
    it('should transform a geodetic coordinate within the grid code zone, containing a non-ascii char', () => {
      const expectedCoord = new grid.GridCode('אבג', ['41', '59', '63']);
      const geodeticCoord = new grid.Geodetic({
        longitude: 35.9,
        latitude: 31.8
      });

      const gridCodeCoord = geodeticCoord.toGridCodeCoord();

      expect(gridCodeCoord).toMatchObject(expectedCoord);
    });
    it('should transform a geodetic coordinate within the grid code zone, in the southern hemisphere, containing a non-ascii char', () => {
      const expectedCoord = new grid.GridCode('שום', ['29', '73', '82']);
      const geodeticCoord = new grid.Geodetic({
        longitude: 35.9,
        latitude: -1.0
      });

      const gridCodeCoord = geodeticCoord.toGridCodeCoord();

      expect(gridCodeCoord).toMatchObject(expectedCoord);
    });
    it('should throw an error if the geodetic coordinate is outside the grid code zone', () => {
      const expectedError = new Error('Could not find a containing grid cell');
      const geodeticCoord = new grid.Geodetic({
        longitude: 80,
        latitude: 80
      });

      expect(() => geodeticCoord.toGridCodeCoord()).toThrow(expectedError);
    });
  });
  describe('transform a geodetic coordinate to UTM coordinate #toUTMCoord', () => {
    it('should transform a geodetic coordinate within the grid code zone, containing a non-ascii char', () => {
      const expectedCoord = new grid.UTM(36, 'N', 774565.936273895, 3521931.043714652);
      const geodeticCoord = new grid.Geodetic({
        longitude: 35.9,
        latitude: 31.8
      });

      const utmCoord = geodeticCoord.toUTMCoord();

      expect(utmCoord).toStrictEqual(expectedCoord);
    });
    it('should transform a geodetic coordinate within the grid code zone, in the southern hemisphere, containing a non-ascii char', () => {
      const expectedCoord = new grid.UTM(36, 'S', 822787.2689717535, 9889327.182016121);
      const geodeticCoord = new grid.Geodetic({
        longitude: 35.9,
        latitude: -1.0
      });

      const utmCoord = geodeticCoord.toUTMCoord();

      expect(utmCoord).toStrictEqual(expectedCoord);
    });
    it('should throw an error if the geodetic coordinate is outside of utm projection bbox', () => {
      const expectedError = 'latitude should be between [-80, 84]';
      const longitude = faker.location.longitude();
      const badLatitude = faker.helpers.arrayElement([faker.location.latitude({ min: -90, max: -80 }), faker.location.latitude({ min: 84, max: 90 })]);
      const geodeticCoord = new grid.Geodetic({
        longitude,
        latitude: badLatitude
      });

      expect(() => geodeticCoord.toUTMCoord()).toThrow(expectedError);
    });
  });
});