import * as proj4 from 'proj4';
import { NUMBER_OF_SUB_LEVELS, UTM_ZONE_LOGITUDE_WIDTH, WGS84_LONGITUDE_ORIGIN } from './constants';
import { Geodetic } from './geodetic';
import { GridCells } from './grid-cells';
import { GridCode } from './grid-code';
import { Hemisphere, SubLevelGridCodeZones, UtmZone } from './types';
import { hemisphereValidation, utmLatitudesValidation, utmZoneValidation } from './validations';

/**
 * Universal transverse mercator projection
 */
export class UTM {
    static MAX_LATITUDE: number = 84;
    static MIN_LATITUDE: number = -80;

    /**
     * Universal transverse mercator projection
     * 
     * @param zone Zone number
     * @param hemisphere N for northern hemisphere, S for southern hemisphere
     * @param easting Easting in meters
     * @param northing Northing in meters
     */
    constructor(private readonly zone: UtmZone, private readonly hemisphere: Hemisphere, private readonly easting: number, private readonly northing: number) {
        this.hemisphere = hemisphereValidation.parse(hemisphere);
        this.zone = utmZoneValidation.parse(zone);
        const geodeticCoord = this.toGeodeticCoord();
        const latitude = geodeticCoord.getLatitude();
        const longitude = geodeticCoord.getLongitude();

        utmLatitudesValidation.parse(latitude);
        const minLongitude = (this.zone - 1) * UTM_ZONE_LOGITUDE_WIDTH + WGS84_LONGITUDE_ORIGIN;
        const maxLongitude = this.zone * UTM_ZONE_LOGITUDE_WIDTH + WGS84_LONGITUDE_ORIGIN;

        if (longitude < minLongitude || longitude >= maxLongitude) {
            throw new Error(`Longitude should be between [${minLongitude}, ${maxLongitude})`);
        }
    }

    /**
     * Get a geodetic coordinate
     * 
     * @returns Geodetic coordinate
     */
    public toGeodeticCoord(): Geodetic {
        // const utmCoord = (new MGRSUTM(this.zone, this.hemisphere === 'N' ? 0 : 1, this.easting, this.northing)).toPoint();
        // return new Geodetic({
        //     longitude: utmCoord.getLongitude(),
        //     latitude: utmCoord.getLatitude()
        // });
        const utmCoord = proj4(`EPSG:32${this.hemisphere === 'N' ? 6 : 7}${this.zone.toString().padStart(2, '0')}`, 'EPSG:4326', { x: this.easting, y: this.northing });
        return new Geodetic({
            longitude: utmCoord.x,
            latitude: utmCoord.y
        });
        // const utmCoord = (new MGRSUTM(this.zone, this.hemisphere === 'N' ? 0 : 1, this.easting, this.northing)).toPoint();
        // return new Geodetic({
        //     longitude: utmCoord.getLongitude(),
        //     latitude: utmCoord.getLatitude()
        // });
    }

    /**
     * Get a grid code coordinate
     * 
     * @returns Grid code coordinate
     */
    public toGridCode(): GridCode {
        const gridCodeCell = GridCells.grid?.find(gridCodeCell => {
            return gridCodeCell.hemisphere === this.hemisphere &&
                gridCodeCell.zone === this.zone &&
                gridCodeCell.left <= this.easting && this.easting < gridCodeCell.right &&
                gridCodeCell.bottom <= this.northing && this.northing < gridCodeCell.top;
        });
        if (!gridCodeCell) throw new Error('Could not find a containing grid cell');

        const localEasting = this.localCoordinate(this.easting - gridCodeCell.left);
        const localNorthing = this.localCoordinate(this.northing - gridCodeCell.bottom);
        const subLevelGridCodeZones: SubLevelGridCodeZones = [
            localEasting[0] + localNorthing[0],
            localEasting[1] + localNorthing[1],
            localEasting[2] + localNorthing[2]
        ];
        return new GridCode(gridCodeCell.gridCodeZone, subLevelGridCodeZones);
    }

    /**
     * Get hemisphere
     * 
     * @returns Hemisphere 'N' or 'S'
     */
    public getHemisphere(): Hemisphere {
        return this.hemisphere;
    }

    /**
     * Get UTM zone
     * 
     * @returns UTM zone (1-60)
     */
    public getZone(): UtmZone {
        return this.zone;
    }

    /**
     * Get easting
     * 
     * @returns Easting in units of meters
     */
    public getEasting(): number {
        return this.easting;
    }

    /**
     * Get northing
     * 
     * @returns Northing in units of meters
     */
    public getNorthing(): number {
        return this.northing;
    }

    private localCoordinate(coordinate: number): string {
        return Math.trunc(coordinate).toString().padStart(4, '0').slice(0, NUMBER_OF_SUB_LEVELS);
    }
}