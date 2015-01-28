###
Player has ships and board. Player has opponent.
###
class Player
  constructor: (@pieceArr, @x, @y, @name = "Computer") ->
    @board = new Board @x, @y

  opponent: (@opponent) ->

  placePiece: (horizontal, x, y) ->
    piece = new Ship @pieceArr[-1..], horizontal
    piece.place x, y
    if @board.addPiece(piece)
      #console.log "Just placed a #{@pieceArr[-1..]} at (#{x}, #{y})!"
      @pieceArr.pop()
      return piece
    else
      return false

  attackCoord: (x, y) ->
    if @opponent
      @opponent.board.shootCell(x, y)
    
  randomPieceSetup: ->
    # includes safety counter. will only try to place ships 100 times.
    safety = 0
    while(@pieceArr.length > 0 and safety++ < 100)
      @placePiece getRandomBool(), getRandomInt(1, @x), getRandomInt(1, @y)


getRandomInt = (min, max) ->
  return Math.floor(Math.random() * (max - min + 1)) + min

getRandomBool = () ->
  return Math.random() > 0.5

class Computer extends Player
  setBrain: (@brain) ->

class Human extends Player
  getName: (@name) ->

window.Player = Player
window.Computer = Computer
window.Human = Human


