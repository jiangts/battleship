###
TODO make a settings config object work
Need to create the game boards with listeners, allow setup
###
class Game
  constructor: (@div, @config = x: 10, y: 10, ships: ["Aircraft Carrier", "Battleship", "Submarine", "Cruiser", "Destroyer"]) ->
    @turn = 0
    @p1 = new Player @config.ships, @config.x, @config.y
    @p2 = new Player @config.ships, @config.x, @config.y

  setup: ->
    @p2.cpuSetup()
    # cpu setup is simply placing pieces on the board
    @createBoardUI("attack-board", @p2.board)
    #createGridUI("own-board")
    # @p1.humanSetup()

  #play: ->
  #  turn++
  #  if turn%2 == 0
  #    @p1.waitForMove()
  #  else
  #    @p2.waitForMove()

  #  if @p1.loss
  #    return alert("Player 2 Wins!") # eventaully make it @p2.name wins!
  #  if @p2.loss
  #    return alert("Player 1 Wins!") # eventaully make it @p2.name wins!

  #  @play()

  myTurn: ->
    return @turn&2 == 0

  createBoardUI: (cls, board) ->
    $ =>
      table = $("<table class='#{cls}'>")
      for i in [1..@config.x]
        row = $("<tr class='#{i}'></tr>")
        for j in [1..@config.y]
          cell = $("<td class='#{i},#{j}'></td>")
          row.append cell
          cell.click () ->
            me = $(this)
            coords = me.attr("class")
            [x, y] = coords.split(",")
            if board.shootCell(x, y)
              me.css("background-color", "red")
              alert "HIT!"
            else
              me.css("background-color", "yellow")

        table.append row
      $(@div).append table


window.Game = Game
window.game = new Game('#battleship-game')
game.setup()
