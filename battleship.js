
/*
How to randomly initialize board of pieces?
Handling piece colllisions?
 */

(function() {
  var Board;

  Board = (function() {
    function Board(width, height) {
      this.width = width;
      this.height = height;
      this.board = {};
      this.pieces = [];
    }

    Board.prototype.contains = function(x, y) {
      return x >= 1 && x <= this.width && y >= 1 && y <= this.height;
    };

    Board.prototype.containsCell = function(cell) {
      var x, y, _ref;
      _ref = cell.split(","), x = _ref[0], y = _ref[1];
      return this.contains(x, y);
    };

    Board.prototype.cellRegistered = function(x, y) {
      return ("" + x + "," + y) in this.board;
    };

    Board.prototype.getCell = function(x, y) {
      if (this.cellRegistered && this.contains(x, y)) {
        return this.board("" + x + "," + y);
      }
    };

    Board.prototype.setCell = function(x, y, value) {
      if (this.contains(x, y)) {
        this.board["" + x + "," + y] = value;
        return true;
      }
      return false;
    };

    Board.prototype.cellHasPiece = function(cell) {
      var piece, _i, _len, _ref;
      _ref = this.pieces;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        piece = _ref[_i];
        if (piece.containsCell(cell)) {
          return true;
        }
      }
      return false;
    };

    Board.prototype.addPiece = function(piece) {
      var cell;
      for (cell in piece.cells) {
        console.log(cell);
        if (!(this.containsCell(cell)) || this.cellHasPiece(cell)) {
          return false;
        }
      }
      this.pieces.push(piece);
      return true;
    };

    return Board;

  })();

  window.Board = Board;

}).call(this);


/*
Piece will know where it lives.
 */

(function() {
  var Piece, Ship, shipTypes,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Piece = (function() {
    function Piece(length, horizontal) {
      this.length = length;
      this.horizontal = horizontal != null ? horizontal : true;
      this.cells = {};
    }

    Piece.prototype.isDead = function() {
      var alive, cell, _i, _len, _ref;
      _ref = this.cells;
      for (alive = _i = 0, _len = _ref.length; _i < _len; alive = ++_i) {
        cell = _ref[alive];
        if (alive) {
          return false;
        }
      }
      return true;
    };

    Piece.prototype.flip = function() {
      return this.horizontal = !this.horizontal;
    };

    Piece.prototype.contains = function(x, y) {
      return ("" + x + "," + y) in this.cells;
    };

    Piece.prototype.containsCell = function(cell) {
      var x, y, _ref;
      _ref = cell.split(","), x = _ref[0], y = _ref[1];
      return this.contains(x, y);
    };

    Piece.prototype.place = function(x, y) {
      var i, _i, _ref, _results;
      _results = [];
      for (i = _i = 1, _ref = this.length; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        this.cells["" + x + "," + y] = false;
        if (this.horizontal) {
          _results.push(x++);
        } else {
          _results.push(y++);
        }
      }
      return _results;
    };

    Piece.prototype.remove = function() {
      return this.cells = [];
    };

    return Piece;

  })();

  shipTypes = {
    "Aircraft Carrier": 5,
    "Battleship": 4,
    "Submarine": 3,
    "Cruiser": 3,
    "Destroyer": 2
  };

  Ship = (function(_super) {
    __extends(Ship, _super);

    function Ship(name, horizontal) {
      if (horizontal == null) {
        horizontal = true;
      }
      Ship.__super__.constructor.call(this, shipTypes[name], horizontal);
    }

    return Ship;

  })(Piece);

  window.Ship = Ship;

}).call(this);


/*
Player has ships and board. Player has opponent.
 */

(function() {
  var Player;

  Player = (function() {
    function Player(pieceArr) {
      this.pieceArr = pieceArr;
      this.board = new Board(10, 10);
    }

    Player.prototype.setOpponent = function(opponent) {
      this.opponent = opponent;
    };

    Player.prototype.placePiece = function(horizontal, x, y) {
      var piece;
      piece = new Ship(this.pieceArr.slice(-1), horizontal);
      piece.place(x, y);
      if (this.board.addPiece(piece)) {
        console.log("Just placed a " + this.pieceArr.slice(-1) + " at (" + x + ", " + y + ")!");
        return this.pieceArr.pop();
      } else {
        return false;
      }
    };

    Player.prototype.attackCoord = function(x, y) {
      if (this.opponent) {
        return this.opponent.board.getCell;
      }
    };

    return Player;

  })();

  window.player1 = new Player(["Aircraft Carrier", "Battleship", "Submarine", "Cruiser", "Destroyer"]);

}).call(this);
