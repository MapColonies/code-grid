import { z } from 'zod';
import { GEODETIC_LATITUDE_MORE_LESS_THAN, GEODETIC_LONGITUDE_MORE_LESS_THAN, GRID_CODE_ZONE_LENGTH, SUB_GRID_CODE_ZONE_LEVEL_LENGTH, UTM_LATITUDE_MORE_LESS_THAN } from './constants';

export const utmLatitudesValidation = z.number().gte(-80, UTM_LATITUDE_MORE_LESS_THAN).lte(84, UTM_LATITUDE_MORE_LESS_THAN);

const latitudeValidation = z.number().gte(-90, GEODETIC_LATITUDE_MORE_LESS_THAN).lt(90, GEODETIC_LATITUDE_MORE_LESS_THAN);
const longitudeValidation = z.number().gte(-180, GEODETIC_LONGITUDE_MORE_LESS_THAN).lt(180, GEODETIC_LONGITUDE_MORE_LESS_THAN);
export const geodeticCoordValidation = z.object({
    longitude: longitudeValidation,
    latitude: latitudeValidation
}).strict();

export const gridCodeZoneValidation = z.string().length(GRID_CODE_ZONE_LENGTH);
export const subLevelGridCodeZoneValidation = z.string().length(SUB_GRID_CODE_ZONE_LEVEL_LENGTH);
export const subLevelsGridCodeZoneValidation = z.tuple([subLevelGridCodeZoneValidation, subLevelGridCodeZoneValidation, subLevelGridCodeZoneValidation]);

export const hemisphereValidation = z.literal('N').or(z.literal('S'));

export const utmZoneValidation = z.number().int().gte(1).lte(60);

export const gridCodeCellValidation = z.object({
    left: z.number(),
    bottom: z.number(),
    right: z.number(),
    top: z.number(),
    zone: utmZoneValidation,
    gridCodeZone: gridCodeZoneValidation,
    hemisphere: hemisphereValidation
}).strict();
export const gridCodeCellsValidation = gridCodeCellValidation.array().min(1);