###
Player has ships and board. Player has opponent.
###
class Player
  constructor: (@pieceArr) ->
    @board = new Board 10, 10

  setOpponent: (@opponent) ->

  placePiece: (horizontal, x, y) ->
    piece = new Ship @pieceArr[-1..], horizontal
    piece.place x, y
    if @board.addPiece(piece)
      console.log "Just placed a #{@pieceArr[-1..]} at (#{x}, #{y})!"
      @pieceArr.pop()
    else
      return false

  attackCoord: (x, y) ->
    if @opponent
      @opponent.board.getCell

window.player1 = new Player ["Aircraft Carrier", "Battleship", "Submarine", "Cruiser", "Destroyer"]

