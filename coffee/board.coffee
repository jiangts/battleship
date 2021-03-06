###
How to randomly initialize board of pieces?
Handling piece colllisions?
###
class Board
  # constuctor sets dimensions board
  constructor: (@width, @height) ->
    @board = {}
    @pieces = []

  # board is 1 indexed for convenience
  contains: (x, y) ->
    return x >= 1 && x <= @width && y >= 1 && y <= @height

  containsCell: (cell) ->
    [x, y] = cell.split(",")
    return @contains(x, y)

  toCell: (x, y) ->
    return "#{x},#{y}"

  # input: cell x and y values, and a cell value
  # returns true if cell set, false if unable to set
  # value: true for hit, false for miss
  setCell: (x, y, value) ->
    if @contains(x, y)
      @board[@toCell(x, y)] = value

  shootCell: (x, y) ->
    @setCell(x, y, @cellHasPiece(@toCell(x, y)))

  # input: a cell string
  # returns true if a piece is already on the cell, false otherwise
  cellHasPiece: (cell) ->
    for piece in @pieces
      if piece.containsCell cell
        return true
    return false

  # input: a piece object
  # returns false if unable to place piece, returns true if piece placed
  addPiece: (piece) ->
    for cell of piece.cells
      if !(@containsCell cell) or @cellHasPiece cell
        return false
    @pieces.push(piece)
    return true

window.Board = Board
