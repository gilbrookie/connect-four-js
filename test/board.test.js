import { Board } from '../lib/Board';
import { EMPTY } from '../lib/utils';

describe('Board Tests', () => {
  describe('constructor', () => {
    it('should accept a column and row argument', () => {
      const b = new Board(1,2);
      expect(b).toBeDefined();
    });
    it('should throw an error if column is missing', () => {
      expect(() => new Board(rows=1)).toThrow();
    });
    it('should throw an error if row is missing', () => {
      expect(() => new Board(columns=1)).toThrow();
    });

    it('should populate an internal 2D array', () => {
      const b = new Board(2,3);
      expect(b.get().length).toBe(2);  // length of first array
      expect(b.get()[0].length).toBe(3); // length of 2-d array (0th element)
    });

    it('should fill the array with zeros', () => {
      const columns = 2;
      const rows = 3;
      const b = new Board(columns, rows);
      for(let i = 0; i < columns; i++) {
        for(let j = 0; j < rows; j++) {
          expect(b.get()[i][j]).toBe(EMPTY);
        }
      }
    });
  });

  describe('findCurrentRow()', () => {
    let board;
    beforeAll(() => {
      board = new Board(1,1)
      const testBoard = [
        [1, 0, 1, 1, 1],
        [1, 0, 0, 0, 0],
      ];
      // Initialize a board object, then override the board data
      board.board = testBoard;
    });

    it('should return the lowest playable row for a given column', () => {
      expect(board.findCurrentRow(1)).toBe(0);
      expect(board.findCurrentRow(2)).toBe(1);
    });

    it('should return undefined if the current row not within range', () => {
      expect(board.findCurrentRow(0)).toBeUndefined();
    });
  });

  describe('isEmptySpace()', () => {
    let board;
    beforeAll(() => {
      board = new Board(1,1)
      const testBoard = [
        [1, 0, 1, 1, 1],
        [1, 0, 0, 0, 0],
      ];
      // Initialize a board object, then override the board data
      board.board = testBoard;
    });

    it('should return true if the field contains value 0', () => {
      expect(board.isEmptySpace(0, 1)).toBeTruthy();
    });

    it('should return false if the field contains value non-zero', () => {
      expect(board.isEmptySpace(0, 0)).toBeFalsy();
    });

    it.skip('should return false if the field is out of range', () => {
      expect(board.isEmptySpace(6, 3)).toBeFalsy();
    });

  });

  describe('isValid()', () => {
    let board;
    beforeAll(() => {
      board = new Board(1,1)
      const testBoard = [
        [1, 0, 1, 1, 1],
        [1, 0, 0, 0, 0],
      ];
      // Initialize a board object, then override the board data
      board.board = testBoard;
    });

    it('should return false when column value is out of range', () => {
      // all cases should return false
      expect(board.isValid(-1, 0)).toBeFalsy();
      expect(board.isValid(5, 0)).toBeFalsy();
      expect(board.isValid("not an int", 0)).toBeFalsy();
      expect(board.isValid(1.2, 0)).toBeFalsy();
    });

    it('should return false when row value is out of range', () => {
      // all cases should return false
      expect(board.isValid(0, -1)).toBeFalsy();
      expect(board.isValid(0, 5)).toBeFalsy();
    });
  });

  describe('isPlayable()', () => {
    let board;
    beforeAll(() => {
      board = new Board(2,5)
      // board.printBoard();
      const testBoard = [
        [1, 0, 1, 1, 1],
        [1, 0, 0, 0, 0],
      ];
      // Initialize a board object, then override the board data
      board.board = testBoard;
      // board.printBoard();
    });

    it('should return true if the bottom row is empty', () => {
      expect(board.isPlayable(0, 1)).toBeTruthy();
    });

    it('should return true if the location below is occupied', () => {
      expect(board.isPlayable(1, 2)).toBeTruthy();
    });

    it('should return false if the location is invalid', ()  => {
      expect(board.isPlayable(3, 7)).toBeFalsy();
      expect(board.isPlayable("1", 0)).toBeFalsy();
      expect(board.isPlayable(0, 9)).toBeFalsy();
    });

    it('should return false if the location is occupied', () => {});
    it('should return false if the location below is empty', () => {});

  });

  describe('playTile()', () => {});
});