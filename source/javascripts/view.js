(function () {
if (typeof CSSris === "undefined") {
  window.CSSris = {};
}

// The view handles user interaction and screen updates.
var View = CSSris.View = function (options) {
  this.$el = options.$el;
  this.$next = $('#next-piece');

  this.tick = options.tick || 10; // game clock tick in ms
  this.paused = false;

  this.board = new CSSris.Board({
    level: this.level,
    view: this
  });

  this.build();
  this.bindListener();

  this.buildTinyBoard();
  this.update();

  setInterval(function () {
    if (!this.paused) {
      this.step();
    }
  }.bind(this), this.tick)
};

View.prototype.pause = function () {
  this.paused = !(this.paused);
  if (this.paused) {
    $('body').prepend('<div id="paused"><div class="text">PAUSED</div></div>');
  } else {
    $('#paused').remove();
  }
};

View.prototype.step = function () {
  this.board.tick();
  this.render();
};

View.prototype.update = function () {
  $('#score').text(this.board.points);
  $('#high-score').text(this.board.highscore);
  $('#level').text(this.board.level);
  $('#lines').text(this.board.lines);
  this.updateNextPiece();
};

View.prototype.updateNextPiece = function () {
  var view = this;

  this.$next.find('ul').each(function (y) {
    $(this).find('li').each(function (x) {
      var $li = $(this);
      $li.removeClass();
      $li.addClass(view.board.nextPiece[x][y]);
    });
  });
};

View.prototype.render = function () {
  var view = this;

  this.$el.find('ul').each(function (y) {
    $(this).find('li').each(function (x) {
      var $li = $(this);
      $li.removeClass();
      $li.addClass(view.board.get(x,y));
    });
  });
};

View.prototype.buildTinyBoard = function () {
  var $ul, $li, x, y;

  for (y = 0; y < 4; y++) {
    $ul = $('<ul>');
    for (x = 0; x < 4; x++) {
      $li = $('<li>');
      $ul.append($li);
    }
    this.$next.append($ul);
  }
};

View.prototype.build = function () {
  var $ul, $li, x, y;

  for (y = 0; y < CSSris.Board.Y_DIM; y++) {
    $ul = $('<ul>');
    for (x = 0; x < CSSris.Board.X_DIM; x++) {
      $li = $('<li>');
      $ul.append($li);
    }
    if (y < 2) $ul.addClass('buffer');
    this.$el.append($ul);
  }
};

View.prototype.bindListener = function () {
  var piece = this.board.piece, that = this;

  $(document).on('keydown', function (key) {
    var keyCode = key.which;

    if(keyCode >= 37 && keyCode <= 40) {
      key.preventDefault();
    }

    switch (key.which) {
    case 27: // esc
      that.pause();
      break;
    case 37: // Left
      piece.move("L");
      break;
    case 65: // 'a'
      piece.rotate("L");
      break;
    case 38: // Up
    case 83: // 's'
      piece.rotate("R");
      break;
    case 39: // Right
      piece.move("R");
      break;
    case 40: // Down
      piece.drop();
      break;
    default:
      break;
    }
  });
};

})();
