class TicTacToe {
  /* Tic Tac Toe game class */

  constructor(sign) {
    this._board = ["", "", "", "", "", "", "", "", ""];
    this._playerSign = sign;
    this._canWork = true;

    if (sign == "X")
      this._computerSign = "O";
    else
      this._computerSign = "X";
  }

  filled() {
    for (var i = 0; i < 9; i++) {
      if (this._board[i] == "")
        return false;
    }
    return true;
  }

  equals(a, b, c, sign) {
    if (a == sign && b == sign && c == sign)
      return true;
    return false;
  }

  _printBoard() {
    for (var i = 0; i < 9; i++) {
      console.log(i + "->" + this._board[i]);
    }
  }

  getBoard() {
    return this._board;
  }

  solved(sign) {
    /* Returns true if given sign has won, false otherwise. */
    var b = this._board;
    if (this.equals(b[0], b[1], b[2], sign))
      return true;
    else if (this.equals(b[3], b[4], b[5], sign))
      return true;
    else if (this.equals(b[6], b[7], b[8], sign))
      return true;
    else if (this.equals(b[0], b[3], b[6], sign))
      return true;
    else if (this.equals(b[1], b[4], b[7], sign))
      return true;
    else if (this.equals(b[2], b[5], b[8], sign))
      return true;
    else if (this.equals(b[0], b[4], b[8], sign))
      return true;
    else if (this.equals(b[2], b[4], b[6], sign))
      return true;

    return false;
  }

  putSign(sign, pos) {
    /* Puts the given sign at the given position if position not occupied */
    if (this._board[pos] == "") {
      this._board[pos] = sign;
      return true;
    }
    return false;
  }

  playerChance(pos) {
    /*
      Plays players chance
      Returns true if player wins, false if draw
     */
    if (this._canWork) {
      this._canWork = false;
      var p = this.putSign(this._playerSign, pos);
      if (this.solved(this._playerSign)) {
        this._canWork = true;
        return 1;
      }

      if (this.filled()) {
        this._canWork = true;
        return 2;
      }

      if (p) {
        var that = this;
        this.computerChance();
        this._canWork = true;
        return 3;
      } else {
        this._canWork = true;
      }
    }
  }

  isOneEmpty(a, b, c, sign) {
    /* Returns the empty position if other two position have same sign */
    var bd = this._board;
    if (bd[a] == sign && bd[b] == sign && bd[c] == "")
      return c;
    else if (bd[a] == sign && bd[c] == sign && bd[b] == "")
      return b;
    else if (bd[b] == sign && bd[c] == sign && bd[a] == "")
      return a;
    return -1;
  }

  hasChance(sign) {
    /* Returns the position where player can score and win the game, -1 otherwise */
    var b = this._board;
    var p = sign;
    if (this.isOneEmpty(0, 1, 2, p) != -1)
      return this.isOneEmpty(0, 1, 2, p);
    else if (this.isOneEmpty(3, 4, 5, p) != -1)
      return this.isOneEmpty(3, 4, 5, p);
    else if (this.isOneEmpty(6, 7, 8, p) != -1)
      return this.isOneEmpty(6, 7, 8, p);
    else if (this.isOneEmpty(0, 3, 6, p) != -1)
      return this.isOneEmpty(0, 3, 6, p);
    else if (this.isOneEmpty(1, 4, 7, p) != -1)
      return this.isOneEmpty(1, 4, 7, p);
    else if (this.isOneEmpty(2, 5, 8, p) != -1)
      return this.isOneEmpty(2, 5, 8, p);
    else if (this.isOneEmpty(1, 4, 8, p) != -1)
      return this.isOneEmpty(1, 4, 8, p);
    else if (this.isOneEmpty(2, 4, 6, p) != -1)
      return this.isOneEmpty(2, 4, 6, p);
    return -1;

  }

  computerChance() {
    /* Computer Chooses where to mark next */
    var p = this.hasChance(this._playerSign);
    var c = this.hasChance(this._computerSign);
    console.log("p: " + p);
    console.log("c: " + c);
    // if computer can win in the next move
    if (c != -1) {
      this.putSign(this._computerSign, c);
    }
    // if player can win in the next move
    else if (p != -1) {
      this.putSign(this._computerSign, p)
    }
    // randomly mark an empty box
    else {
      var a = Math.floor(Math.random() * (8 - 0));
      while (this._board[a] != "") {
        a = Math.floor(Math.random() * (8 - 0));
      }
      this.putSign(this._computerSign, a);
    }
  }

  clearBoard() {
    this._board = ["", "", "", "", "", "", "", "", ""];
  }

}

class PerformAction {
  /*  Marks Board depending on the box clicked */
  constructor(sign) {
    this._t = new TicTacToe(sign);
    this._playerSign = sign;
    this._playerScore = 0;
    this._computerScore = 0;

    if (sign == "X")
      this._computerSign = "O";
    else
      this._computerSign = "X";
  }

  reset() {
    this._t.clearBoard();
    this._playerScore = 0;
    this._computerScore = 0;
    this.display();
  }

  mark(pos) {
    var resp = this._t.playerChance(pos);
    //console.log(resp);
    var that = this;
    this.display();
    
    setTimeout(function() {
      that.display();
    }, 1000);
    
    if (resp == 2) {
      // Show Tie Modal
      this.display();
      setTimeout(function() {
        $("#draw").modal('show');
        that._t.clearBoard();
        that.display();
      }, 1000);
      this.display();
    } else if (this._t.solved(this._playerSign)) {
      // Show Player Won Modal
      this._playerScore++;
      console.log("Player score: " + this._playerScore);
      setTimeout(function() {
        $("#win").modal('show');
        that._t.clearBoard();
        that.display();
      }, 1000);
      this.display();
    } else if (this._t.solved(this._computerSign)) {
      // Show Computer Won Modal
      this._computerScore++;
      console.log("Computer Score: " + this._computerScore);
      setTimeout(function() {
        $("#lose").modal('show');
        that._t.clearBoard();
        that.display();
      }, 1000);
      this.display();
    }

  }

  display() {
    var b = this._t.getBoard();
    $("#zero").html(b[0]);
    $("#one").html(b[1]);
    $("#two").html(b[2]);
    $("#three").html(b[3]);
    $("#four").html(b[4]);
    $("#five").html(b[5]);
    $("#six").html(b[6]);
    $("#seven").html(b[7]);
    $("#eight").html(b[8]);
    $("#computer-score").html(this._computerScore);
    $("#player-score").html(this._playerScore);
  }
}

//ttt = new PerformAction("X");
var ttt;
$(document).ready(function() {
  $("#myModal").modal({
    keyboard: false,
    backdrop: 'static'
  }, 'show');
  var ttt;

  $(".reset").on('click', function() {
    ttt.reset();

  });

  $("#button1").on('click', function() {
    ttt = new PerformAction("X");
  });

  $("#button2").on('click', function() {
    ttt = new PerformAction("O");
  });

  $("#tic-tac div").on('click', function() {
    var id = this.id;
    console.log(this.id);

    switch (id) {
      case "zero":
        ttt.mark(0);
        break;
      case "one":
        ttt.mark(1);
        break;
      case "two":
        ttt.mark(2);
        break;
      case "three":
        ttt.mark(3);
        break;
      case "four":
        ttt.mark(4);
        break;
      case "five":
        ttt.mark(5);
        break;
      case "six":
        ttt.mark(6);
        break;
      case "seven":
        ttt.mark(7);
        break;
      case "eight":
        ttt.mark(8);
        break;
    }
  });
});