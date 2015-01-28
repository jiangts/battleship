
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

    Board.prototype.toCell = function(x, y) {
      return "" + x + "," + y;
    };

    Board.prototype.setCell = function(x, y, value) {
      if (this.contains(x, y)) {
        return this.board[this.toCell(x, y)] = value;
      }
    };

    Board.prototype.shootCell = function(x, y) {
      return this.setCell(x, y, this.cellHasPiece(this.toCell(x, y)));
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

    Piece.prototype.toCell = function(x, y) {
      return "" + x + "," + y;
    };

    Piece.prototype.contains = function(x, y) {
      return this.toCell(x, y) in this.cells;
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
        this.cells[this.toCell(x, y)] = false;
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
  var Player, getRandomBool, getRandomInt;

  Player = (function() {
    function Player(pieceArr, x, y) {
      this.pieceArr = pieceArr;
      this.x = x;
      this.y = y;
      this.board = new Board(this.x, this.y);
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
        return this.opponent.board.shootCell(x, y);
      }
    };

    Player.prototype.cpuSetup = function() {
      var safety, _results;
      safety = 0;
      _results = [];
      while (this.pieceArr.length > 0 && safety++ < 100) {
        _results.push(this.placePiece(getRandomBool(), getRandomInt(1, this.x), getRandomInt(1, this.y)));
      }
      return _results;
    };

    return Player;

  })();

  getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  getRandomBool = function() {
    return Math.random() > 0.5;
  };

  window.Player = Player;

}).call(this);


/*
TODO make a settings config object work
Need to create the game boards with listeners, allow setup
 */

(function() {
  var Game;

  Game = (function() {
    function Game(div, config) {
      this.div = div;
      this.config = config != null ? config : {
        x: 10,
        y: 10,
        ships: ["Aircraft Carrier", "Battleship", "Submarine", "Cruiser", "Destroyer"]
      };
      this.turn = 0;
      this.p1 = new Player(this.config.ships, this.config.x, this.config.y);
      this.p2 = new Player(this.config.ships, this.config.x, this.config.y);
    }

    Game.prototype.setup = function() {
      this.p2.cpuSetup();
      return this.createBoardUI("attack-board", this.p2.board);
    };

    Game.prototype.myTurn = function() {
      return this.turn & 2 === 0;
    };

    Game.prototype.createBoardUI = function(cls, board) {
      return $((function(_this) {
        return function() {
          var cell, i, j, row, table, _i, _j, _ref, _ref1;
          table = $("<table class='" + cls + "'>");
          for (i = _i = 1, _ref = _this.config.x; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
            row = $("<tr class='" + i + "'></tr>");
            for (j = _j = 1, _ref1 = _this.config.y; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 1 <= _ref1 ? ++_j : --_j) {
              cell = $("<td class='" + i + "," + j + "'></td>");
              row.append(cell);
              cell.click(function() {
                var coords, me, x, y, _ref2;
                me = $(this);
                coords = me.attr("class");
                _ref2 = coords.split(","), x = _ref2[0], y = _ref2[1];
                if (board.shootCell(x, y)) {
                  me.css("background-color", "red");
                  return alert("HIT!");
                } else {
                  return me.css("background-color", "yellow");
                }
              });
            }
            table.append(row);
          }
          return $(_this.div).append(table);
        };
      })(this));
    };

    return Game;

  })();

  window.Game = Game;

  window.game = new Game('#battleship-game');

  game.setup();

}).call(this);
