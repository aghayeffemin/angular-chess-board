import { Component } from '@angular/core';
import { ChessPieces, ChessPiecesCodes } from './models/chess-pieces';
import { initialBoardPosition } from './models/initial-board-position';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  numbers = [8, 7, 6, 5, 4, 3, 2, 1];
  possibleMoves: string[] = [];
  consumableMoves: string[] = [];
  selectedElem: any = '';
  isboardRotated: boolean = false;
  isWhiteTurn = true;

  getPieceCodes(row: any, col: any) {
    let posVal = row + col;
    if (initialBoardPosition[posVal] === '') return;
    let pieceName = ChessPieces[initialBoardPosition[posVal].name]
    console.log(pieceName)
    return ChessPiecesCodes[pieceName];
  }

  selectCell(row: any, col: number) {
    this.clearSelectedCells();
    let cellValue = row + col;
    if (
      initialBoardPosition[cellValue] === '' &&
      this.possibleMoves.length > 0 &&
      this.selectedElem !== ''
    ) {
      if (this.possibleMoves.indexOf(cellValue) !== -1) {
        initialBoardPosition[cellValue] =
          initialBoardPosition[this.selectedElem];
        initialBoardPosition[cellValue].isFirstMove = false;
        initialBoardPosition[this.selectedElem] = '';
      }
      this.possibleMoves = [];
      this.selectedElem = '';
      return;
    }

    // pawn
    this.selectedElem = cellValue;
    let pieceObj = initialBoardPosition[cellValue];

    if (
      pieceObj.name == ChessPieces.WhitePawn ||
      pieceObj.name == ChessPieces.BlackPawn
    ) {
      let pawnMoves = this.getPossiblePawnMoves(pieceObj, row, col);
      this.possibleMoves = pawnMoves.move;
      this.consumableMoves = pawnMoves.consumable;

      this.consumableMoves.forEach((element) => {
        let elem = document.getElementById(element) as HTMLElement;
        elem.classList.add('possible-move-class');
      });

      this.possibleMoves.forEach((element) => {
        let elem = document.getElementById(element) as HTMLElement;
        elem.classList.add('possible-move-class');
      });
    }
  }

  getPossiblePawnMoves(pieceObj: any, row: any, col: number) {
    let moveArr: string[] = [];
    let consumableArr: string[] = [];
    if (pieceObj.color === 'white') {
      let hasBlockingPiece = initialBoardPosition[row + (col + 1)] !== '';

      if (this.letters.indexOf(row) === this.letters.length - 1) {
        consumableArr = [
          this.letters[this.letters.indexOf(row) - 1] + (col + 1),
        ];
      } else if (this.letters.indexOf(row) === 0) {
        consumableArr = [
          this.letters[this.letters.indexOf(row) + 1] + (col + 1),
        ];
      } else {
        consumableArr = [
          this.letters[this.letters.indexOf(row) + 1] + (col + 1),
          this.letters[this.letters.indexOf(row) - 1] + (col + 1),
        ];
      }

      if (hasBlockingPiece) {
        moveArr = [];
      } else if (pieceObj.isFirstMove) {
        moveArr = [row + (col + 1), row + (col + 2)];
      } else {
        moveArr = [row + (col + 1)];
      }
    }
    if (pieceObj.color === 'black') {
      let hasBlockingPiece = initialBoardPosition[row + (col - 1)] !== '';

      if (this.letters.indexOf(row) === this.letters.length - 1) {
        consumableArr = [
          this.letters[this.letters.indexOf(row) - 1] + (col - 1),
        ];
      } else if (this.letters.indexOf(row) === 0) {
        consumableArr = [
          this.letters[this.letters.indexOf(row) + 1] + (col - 1),
        ];
      } else {
        consumableArr = [
          this.letters[this.letters.indexOf(row) + 1] + (col - 1),
          this.letters[this.letters.indexOf(row) - 1] + (col - 1),
        ];
      }

      if (hasBlockingPiece) {
        moveArr = [];
      } else if (pieceObj.isFirstMove) {
        moveArr = [row + (col - 1), row + (col - 2)];
      } else {
        moveArr = [row + (col - 1)];
      }
    }

    moveArr.forEach((el, i) => {
      if (initialBoardPosition[el] !== '') {
        moveArr.splice(i, 1);
      }
    });

    consumableArr = consumableArr.filter(function (el) {
      let boardPos = initialBoardPosition[el];
      return (
        boardPos !== '' && pieceObj.color !== initialBoardPosition[el].color
      );
    });

    return { move: moveArr, consumable: consumableArr };
  }

  getConsumableArr() {}

  rotateBoard() {
    if (this.isboardRotated) {
      this.letters.sort((a, b) => 0 - (a > b ? -1 : 1));
      this.numbers.sort((a, b) => 0 - (a > b ? 1 : -1));
    } else {
      this.letters.sort((a, b) => 0 - (a > b ? 1 : -1));
      this.numbers.sort((a, b) => 0 - (a > b ? -1 : 1));
    }
    this.isboardRotated = !this.isboardRotated;
  }

  clearSelectedCells() {
    const elems = Array.from(
      document.getElementsByClassName(
        'possible-move-class'
      ) as HTMLCollectionOf<HTMLElement>
    );
    elems.forEach((el) => {
      el.classList.remove('possible-move-class');
    });
  }
}
