class Brain
  constructor: (@x, @y, @owner) ->
    @history = {}
  attack: ->
    x = getRandomInt(1, @x)
    y = getRandomInt(1, @y)
    cell = "#{x},#{y}"
    if cell of @history
      @attack()
    else
      @history[cell] = @owner.attackCoord(x, y)
    return cell

window.Brain = Brain

getRandomInt = (min, max) ->
  return Math.floor(Math.random() * (max - min + 1)) + min

