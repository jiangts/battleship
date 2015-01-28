###
Piece will know where it lives.
###
class Piece
  # orientation 0 is horizontal, 1 is vertical
  constructor: (@length, @horizontal = true) ->
    @cells = {}

  isDead: ->
    for cell, alive in @cells
      if alive then return false
    return true

  flip: ->
    @horizontal = !@horizontal

  toCell: (x, y) ->
    return "#{x},#{y}"

  contains: (x, y) ->
    return @toCell(x, y) of @cells

  containsCell: (cell) ->
    [x, y] = cell.split(",")
    return @contains(x, y)

  place: (x, y) ->
    for i in [1..@length]
      @cells[@toCell(x, y)] = false
      if @horizontal then x++ else y++

  remove: ->
    @cells = []

shipTypes =
  "Aircraft Carrier": 5
  "Battleship": 4
  "Submarine": 3
  "Cruiser": 3
  "Destroyer": 2

class Ship extends Piece
  constructor: (name, horizontal = true) ->
    super shipTypes[name], horizontal

window.Ship = Ship
