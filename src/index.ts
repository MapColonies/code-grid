import { Geodetic } from './geodetic';
import { GridCells } from './grid-cells';
import { GridCode } from './grid-code';
import { defineProjectionsTransformations } from './projections';
import { GridCodeCells } from './types';
import { UTM } from './utm';

export class CodeGrid {
    readonly Geodetic: typeof Geodetic;
    readonly GridCode: typeof GridCode;
    readonly UTM: typeof UTM;

    /**
     * CodeGrid
     * 
     * @param gridCodeCells Grid code zones data
     * @example import { CodeGrid } from '@map-colonies/code-grid';
     * const gridCodeZones: GridCodeZone[] = await fetch('http://example.com/grid-code-zones'); // get grid code zones data from external source
     * const grid = new CodeGrid(gridCodeZones);
     * 
     * const gridCode = new grid.GridCode('ABC', ['00', '01', '10']);
     * const geodetic = new grid.Geodetic(35, 35);
     * const utm = new grid.UTM(36, 'N', 50000, 35000000);
     */
    public constructor(gridCodeCells: GridCodeCells) {
        defineProjectionsTransformations();
        new GridCells(gridCodeCells); // set the grid code zones data for all the following calculations
        this.Geodetic = Geodetic;
        this.GridCode = GridCode;
        this.UTM = UTM;
    }
}