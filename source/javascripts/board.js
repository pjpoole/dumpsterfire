(function () {
if (typeof CSSris === "undefined") {
  window.CSSris = {};
}

// This is where the logic for the game gets stored and interpreted.
var Board = CSSris.Board = function (options) {
  // TODO: save highscore

  this.view = options.view;

  this.clearBoard();
  this.nextPiece = [[],[],[],[]];

  this.piece = new CSSris.Piece(this);

  this.level = options.level || 1;
  this.tickCounter = 0;

  this.highscore = 0;
  this.points = 0;
  this.lines = 0;

  this.updateNextPiece();

};

// Standard Tetris board size
Board.X_DIM = 10;
Board.Y_DIM = 22;

Board.SCORES = [0, 40, 100, 300, 1200];

Board.prototype.tick = function () {
  if (this.tickCounter-- <= 0) {
    this.step();
    this.tickCounter = Math.max((40 - 2 * this.level), 1);
  }
};

Board.prototype.step = function () {
  this.piece.step();
};

Board.prototype.stop = function (points) {
  var counter, rows = 0, x, y;
  for (y = 0; y < Board.Y_DIM; y++) {
    counter = 0;
    for (x = 0; x < Board.X_DIM; x++) {
      if (this.get(x, y)) {
        counter++;
      }
    }
    if (counter === Board.X_DIM) {
      this.clearRow(y);
      rows++;
    }
  }
  this.lines += rows;
  this.level = Math.floor(this.lines / 10) + 1;
  this.points += this.level * Board.SCORES[rows] + points;
  this.updateNextPiece();

  this.view.update();
};

Board.prototype.clearRow = function (y_source) {
  var x, y;
  for (y = y_source; y >= 1; y--) {
    for (x = 0; x < Board.X_DIM; x++) {
      this.set(x, y, this.get(x, y - 1));
    }
  }
};

Board.prototype.gameOver = function () {
  this.highscore = Math.max(this.points, this.highscore);
  this.points = 0;
  this.lines = 0;

  this.clearBoard();
  this.view.update();
};

Board.prototype.clearBoard = function () {
  var x, y;

  for (x = 0; x < Board.X_DIM; x++) {
    for (y = 0; y < Board.Y_DIM; y++) {
      this.set(x, y, false);
    }
  }
};

Board.prototype.updateNextPiece = function () {
  var x, y, piece = this.piece.nextPiece;

  for (y = 0; y < 4; y++) {
    for (x = 0; x < 4; x++) {
      this.nextPiece[x][y] = false;
    }
  }

  piece.offsets[0].forEach(function (offs) {
    this.nextPiece[offs[0] + 2][offs[1] + 1] = piece.name;
  }, this);
};

Board.prototype.get = function (x, y) {
  if (this.inbounds(x, y)) {
    return this.grid()[x][y];
  } else {
    return true;
  }
},

Board.prototype.set = function (x, y, val) {
  if (this.inbounds(x, y)) {
    this.grid()[x][y] = val;
  }
},

Board.prototype.isValid = function (x, y) {
  return (!this.get(x, y));
};

Board.prototype.inbounds = function (x, y) {
  return ((x >= 0 && x < Board.X_DIM) && (y >= 0 && y < Board.Y_DIM));
};

Board.prototype.grid = function () {
  var x;

  if (!this._grid) {
    this._grid = new Array(Board.X_DIM);
    for (x = 0; x < Board.X_DIM; x++) {
      this._grid[x] = new Array(Board.Y_DIM);
    }
  }

  return this._grid;
};

Board.prototype.render = function () {
  var val, x, y;

  str = "";

  for (y = 0; y < Board.Y_DIM; y++) {
    for (x = 0; x < Board.X_DIM; x++) {
      val = this.get(x, y);

      if (val) {
        str += "val";
      } else {
        str += " ";
      }
    }
    str += "\n";
  }

  return str;
};


})();
