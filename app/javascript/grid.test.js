import { Block, BlockGrid, COLOURS } from './grid';
import { assert } from 'chai';
import { testGrid } from '../helpers/testGrid';
import { expGrid } from '../helpers/expGrid';


describe('Block', () => {
  it('should be created with correct coordinates and one of the valid colours', () => {
    let testCoords = [[1, 2], [4, 9], [0, 0]];

    testCoords.forEach(testCoord => {
      let block = new Block(...testCoord);
      assert.equal(block.x, testCoord[0], 'x is set correctly');
      assert.equal(block.y, testCoord[1], 'y is set correctly');
      assert.ok(COLOURS.indexOf(block.colour) > -1, 'colour is valid');
    });
  });
});

describe('BlockGrid', () => {
  let blockGrid = new BlockGrid();

  beforeEach(function() {
    blockGrid.grid = testGrid;
  });

  it('should remove clicked color shape', () => {
    blockGrid.rerender = () => {};
    blockGrid.blockClicked({}, blockGrid.grid[0][6]);
    assert.deepEqual(blockGrid.grid, expGrid, 'to be equal');
  });
});
