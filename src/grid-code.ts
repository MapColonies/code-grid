import { Geodetic } from './geodetic';
import { GridCells } from './grid-cells';
import { GridCodeCell, SubLevelGridCodeZones } from './types';
import { UTM } from './utm';
import { gridCodeZoneValidation, subLevelsGridCodeZoneValidation } from './validations';

// TODO: validate that grid codes do not extend beyond 80S-84N latitude
/**
 * Grid code
 */
export class GridCode {
    private readonly gridCodeCell: GridCodeCell;
    /**
     * Grid code
     * 
     * @param gridCodeZone Grid code zone designator string
     * @param subLevelGridCodeZones Array of sub level grid code zones strings
     * @example const gridCode = new GridCode('ABC', ['00', '01', '10']);
     */
    constructor(private readonly gridCodeZone: string, private readonly subLevelGridCodeZones: SubLevelGridCodeZones) {
        this.gridCodeZone = gridCodeZoneValidation.parse(gridCodeZone);
        this.subLevelGridCodeZones = subLevelsGridCodeZoneValidation.parse(subLevelGridCodeZones);

        const gridCodeCell = GridCells.grid?.find(gridCodeCell => gridCodeCell.gridCodeZone === this.gridCodeZone);
        if (!gridCodeCell) throw new Error(`Could not find a containing grid cell for ${this.gridCodeZone}`);
        this.gridCodeCell = gridCodeCell;
    }

    /**
     * Get a geodetic coordinate of south-west corner of the grid code
     * 
     * @returns Geodetic coordinate
     */
    public toGeodeticCoord(): Geodetic {
        const geodeticCoord = this.toUTMCoord().toGeodeticCoord();

        return new Geodetic({
            longitude: geodeticCoord.getLongitude(),
            latitude: geodeticCoord.getLatitude()
        });
    }

    /**
     * Get a UTM coordinate of south-west corner of the grid code
     * 
     * @returns UTM coordinate
     */
    public toUTMCoord(): UTM {
        const utmCoord = this.subLevelGridCodeZones.reduce((utmCoord, subLevelGridCodeZone, index) => {
            const magnitude = 1000 / (10 ** index);
            return {
                easting: utmCoord.easting + Number.parseInt(subLevelGridCodeZone.charAt(0)) * magnitude,
                northing: utmCoord.northing + Number.parseInt(subLevelGridCodeZone.charAt(1)) * magnitude
            };
        }, {
            easting: this.gridCodeCell.left,
            northing: this.gridCodeCell.bottom
        });

        return new UTM(this.gridCodeCell.zone, this.gridCodeCell.hemisphere, utmCoord.easting, utmCoord.northing);
    }

    /**
     * Get a formatted string of the grid code
     * 
     * @returns Formatted string
     */
    public toString(): string {
        return `${this.gridCodeZone} ${this.subLevelGridCodeZones.join('')}`
    }
}