
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
      var cell, hit, ship, _ref;
      cell = this.toCell(x, y);
      _ref = this.cellHasPiece(cell), hit = _ref[0], ship = _ref[1];
      this.setCell(x, y, hit);
      if (ship) {
        return ship.cells[cell] = hit;
      }
    };

    Board.prototype.cellHasPiece = function(cell) {
      var piece, _i, _len, _ref;
      _ref = this.pieces;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        piece = _ref[_i];
        if (piece.containsCell(cell)) {
          return [true, piece];
        }
      }
      return false;
    };

    Board.prototype.addPiece = function(piece) {
      var cell;
      for (cell in piece.cells) {
        if (!(this.containsCell(cell)) || this.cellHasPiece(cell)[0]) {
          piece.remove();
          return false;
        }
      }
      this.pieces.push(piece);
      return true;
    };

    Board.prototype.checkLoss = function() {
      var ship, _i, _len, _ref;
      _ref = this.pieces;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ship = _ref[_i];
        window.dbg = ship;
        if (!ship.isDead()) {
          return false;
        }
      }
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
      var cell, dead, _ref;
      _ref = this.cells;
      for (cell in _ref) {
        dead = _ref[cell];
        if (!dead) {
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

(function() {
  var Brain, getRandomInt;

  Brain = (function() {
    function Brain(x, y, owner) {
      this.x = x;
      this.y = y;
      this.owner = owner;
      this.history = {};
    }

    Brain.prototype.attack = function() {
      var cell, x, y;
      x = getRandomInt(1, this.x);
      y = getRandomInt(1, this.y);
      cell = "" + x + "," + y;
      if (cell in this.history) {
        this.attack();
      } else {
        this.history[cell] = this.owner.attackCoord(x, y);
      }
      return cell;
    };

    return Brain;

  })();

  window.Brain = Brain;

  getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

}).call(this);


/*
Player has ships and board. Player has opponent.
 */

(function() {
  var Computer, Human, Player, getRandomBool, getRandomInt,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Player = (function() {
    function Player(pieceArr, x, y, name) {
      this.pieceArr = pieceArr;
      this.x = x;
      this.y = y;
      this.name = name != null ? name : "Computer";
      this.board = new Board(this.x, this.y);
    }

    Player.prototype.opponent = function(opponent) {
      this.opponent = opponent;
    };

    Player.prototype.placePiece = function(horizontal, x, y) {
      var piece;
      piece = new Ship(this.pieceArr.slice(-1), horizontal);
      piece.place(x, y);
      if (this.board.addPiece(piece)) {
        this.pieceArr.pop();
        return piece;
      } else {
        return false;
      }
    };

    Player.prototype.attackCoord = function(x, y) {
      if (this.opponent) {
        return this.opponent.board.shootCell(x, y);
      }
    };

    Player.prototype.randomPieceSetup = function() {
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

  Computer = (function(_super) {
    __extends(Computer, _super);

    function Computer() {
      return Computer.__super__.constructor.apply(this, arguments);
    }

    Computer.prototype.setBrain = function(brain) {
      this.brain = brain;
    };

    return Computer;

  })(Player);

  Human = (function(_super) {
    __extends(Human, _super);

    function Human() {
      return Human.__super__.constructor.apply(this, arguments);
    }

    Human.prototype.getName = function(name) {
      this.name = name;
    };

    return Human;

  })(Player);

  window.Player = Player;

  window.Computer = Computer;

  window.Human = Human;

}).call(this);

(function() {
  var Game,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Game = (function() {
    function Game(div, config) {
      this.div = div;
      this.config = config != null ? config : {
        x: 10,
        y: 10,
        ships: ["Aircraft Carrier", "Battleship", "Submarine", "Cruiser", "Destroyer"]
      };
      this.handleSetupCellClick = __bind(this.handleSetupCellClick, this);
      this.handleAttackCellClick = __bind(this.handleAttackCellClick, this);
      this.turn = 0;
      this.p1 = new Human(this.config.ships.slice(), this.config.x, this.config.y);
      this.p2 = new Computer(this.config.ships.slice(), this.config.x, this.config.y);
    }

    Game.prototype.setup = function() {
      this.createUI("attack-board", this.p2.board, this.handleAttackCellClick);
      this.p2.randomPieceSetup();
      this.p2.opponent(this.p1);
      this.p2.setBrain(new Brain(this.config.x, this.config.y, this.p2));
      return $((function(_this) {
        return function() {
          _this.createUI("own-board", _this.p1.board, _this.handleSetupCellClick);
          return _this.setMessage("Please click on the board to the right to set up your pieces");
        };
      })(this));
    };

    Game.prototype.play = function() {
      var move;
      move = (function(_this) {
        return function() {
          var coord;
          _this.turn++;
          if (_this.myTurn()) {
            return _this.setMessage("Your move");
          } else {
            _this.setMessage("Computer to move");
            coord = _this.p2.brain.attack();
            _this.markCell("own-board", coord);
            if (_this.p1.board.checkLoss() === true) {
              alert("Computer wins!");
            }
            return _this.play();
          }
        };
      })(this);
      return setTimeout(move, 1000);
    };

    Game.prototype.myTurn = function() {
      return this.turn % 2 === 1;
    };

    Game.prototype.createUI = function(cls, board, cb) {
      return $((function(_this) {
        return function() {
          var cell, i, j, row, table, _i, _j, _ref, _ref1;
          table = $("<table class='" + cls + "'>");
          for (i = _i = 1, _ref = _this.config.x; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
            row = $("<tr class='" + i + "'></tr>");
            for (j = _j = 1, _ref1 = _this.config.y; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 1 <= _ref1 ? ++_j : --_j) {
              cell = $("<td class='" + j + "-" + i + "'></td>");
              row.append(cell);
              cell.click(function() {
                return cb($(this), board);
              });
            }
            table.append(row);
          }
          return $(_this.div).append(table);
        };
      })(this));
    };

    Game.prototype.setMessage = function(msg) {
      if (!this.message) {
        this.message = $("<center></center>");
        this.message.insertAfter($(this.div));
      }
      return this.message.text(msg);
    };

    Game.prototype.handleAttackCellClick = function(me, board) {
      var coords, x, y, _ref;
      if (this.turn === 0) {
        return this.setMessage("Place your ships first so we can start the game!");
      }
      if (this.myTurn()) {
        coords = me.attr("class");
        _ref = coords.split("-"), x = _ref[0], y = _ref[1];
        if (board.shootCell(x, y)) {
          if (me.css("background-color") !== "rgb(255, 0, 0)") {
            this.setMessage("Hit!");
          }
          me.css("background-color", "red");
          if (board.checkLoss() === true) {
            alert("Congratulations, you win!");
          }
        } else {
          this.setMessage("Miss");
          me.css("background-color", "yellow");
        }
        return this.play();
      } else {
        return this.setMessage("It's not your turn!");
      }
    };

    Game.prototype.handleSetupCellClick = function(me, board) {
      var coords, horizontal, ship, x, y, _i, _len, _ref, _ref1;
      if (this.turn === 0) {
        coords = me.attr("class");
        _ref = coords.split("-"), x = _ref[0], y = _ref[1];
        horizontal = prompt("Enter \"H\" for horizontal placement and \"V\" for vertical placement. If you're lazy, hit \"R\" for random placement", "");
        switch (horizontal) {
          case "H":
            horizontal = true;
            break;
          case "V":
            horizontal = false;
            break;
          case "R":
            this.p1.randomPieceSetup();
            _ref1 = this.p1.board.pieces;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              ship = _ref1[_i];
              this.colorShip(ship, me);
            }
            return this.play();
          default:
            return this.setMessage("Did not understand your format");
        }
        ship = this.p1.placePiece(horizontal, x, y);
        if (ship !== false) {
          this.setMessage("Successfully placed " + this.p1.pieceArr.slice(-1));
          this.colorShip(ship, me);
          if (this.p1.pieceArr.length === 0) {
            return this.play();
          }
        } else {
          return this.setMessage("Your ship can't go there!");
        }
      }
    };

    Game.prototype.markCell = function(tableCls, coord) {
      var cell, selector, table;
      table = $("." + tableCls);
      selector = coord.replace(",", "-");
      cell = table.find("." + selector);
      return cell.html('<p style="text-align: center;">X</p>');
    };

    Game.prototype.colorShip = function(ship, me) {
      var cell, coord, selector, table, _results;
      table = me.parents('table');
      _results = [];
      for (coord in ship.cells) {
        selector = coord.replace(",", "-");
        cell = table.find("." + selector);
        _results.push(cell.css('background-color', 'gray'));
      }
      return _results;
    };

    return Game;

  })();

  window.Game = Game;

  window.game = new Game('#battleship-game');

  game.setup();

}).call(this);
