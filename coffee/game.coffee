###
TODO make a settings config object work
Need to create the game boards with listeners, allow setup
###
class Game
  constructor: (@div, @config = x: 10, y: 10, ships: ["Aircraft Carrier", "Battleship", "Submarine", "Cruiser", "Destroyer"]) ->
    @turn = 0
    @p1 = new Human @config.ships.slice(), @config.x, @config.y
    @p2 = new Computer @config.ships.slice(), @config.x, @config.y

  setup: ->
    @createUI("attack-board", @p2.board, @handleAttackCellClick)
    @p2.cpuSetup()  # cpu setup is simply placing pieces on the board
    @p2.opponent(@p1)
    @p2.setBrain(new Brain @config.x, @config.y, @p2)
    $ =>
      @createUI("own-board", @p1.board, @handleSetupCellClick)
      @setMessage "Please click on the board to the right to set up your pieces"
      # Human Setup

  play: ->
    @turn = @turn + 1
    console.log @turn, @myTurn()
    move = =>
      if @myTurn()
        @setMessage "Your move"
      else
        @setMessage "Computer to move"
        coord = @p2.brain.attack()
        @markCell("own-board", coord)
        if @p1.board.checkLoss() is true
          alert "Computer wins!"
        @play()
    setTimeout move, 1000

  myTurn: ->
    return @turn%2 is 1

  createUI: (cls, board, cb) ->
    $ =>
      table = $("<table class='#{cls}'>")
      for i in [1..@config.x]
        row = $("<tr class='#{i}'></tr>")
        for j in [1..@config.y]
          cell = $("<td class='#{j}-#{i}'></td>")
          row.append cell
          cell.click () ->
            cb $(this), board

        table.append row
      $(@div).append table

  setMessage: (msg) ->
    if !@message
      @message = $("<center></center>")
      @message.insertAfter $(@div)
      #$(@div).append ["<br>", "<br>", @message]
    @message.text msg

  handleAttackCellClick: (me, board) =>
    if @turn > 0 and @myTurn()
      coords = me.attr("class")
      [x, y] = coords.split("-")
      if board.shootCell(x, y)
        if me.css("background-color") isnt "rgb(255, 0, 0)"
          @setMessage "Hit!"
        me.css("background-color", "red")
        if board.checkLoss() is true
          alert "Congratulations, you win!"
      else
        @setMessage "Miss"
        me.css("background-color", "yellow")
      @play()
    else
      @setMessage "Place your ships first so we can start the game!"

  handleSetupCellClick: (me, board) =>
    if @turn is 0
      coords = me.attr("class")
      [x, y] = coords.split("-")
      horizontal = prompt("Enter \"H\" for horizontal placement and \"V\" for vertical placement", "")
      if horizontal isnt "H" and horizontal isnt "V" then return @setMessage "Did not understand your format"
      if horizontal is "H" then horizontal = true
      if horizontal is "V" then horizontal = false
      ship = @p1.placePiece horizontal, x, y
      if ship isnt false
        @setMessage "Successfully placed #{@p1.pieceArr[-1..]}"
        @colorShip ship, me
        if @p1.pieceArr.length is 0
          @play()
      else @setMessage "Your ship can't go there!"

  markCell: (tableCls, coord) ->
    table = $(".#{tableCls}")
    selector = coord.replace(",", "-")
    cell = table.find(".#{selector}")
    cell.html('<p style="text-align: center;">X</p>')
      
  colorShip: (ship, me) ->
    table = me.parents('table')
    for coord of ship.cells
      selector = coord.replace(",", "-")
      cell = table.find(".#{selector}")
      cell.css('background-color', 'gray')
      

window.Game = Game
window.game = new Game('#battleship-game')
game.setup()
