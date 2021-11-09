phina.globalize();

var SCREEN_WIDTH    = 640;
var SCREEN_HEIGHT   = 960;
var MAX_PER_LINE    = 5;                            // ピースの横に並ぶ最大数
var PIECE_SIZE      = 100;
var BOARD_PADDING   = 40;

var MAX_NUM         = MAX_PER_LINE*MAX_PER_LINE;    // ピース全体の数
var BOARD_SIZE      = SCREEN_WIDTH - BOARD_PADDING*2;
var BOARD_OFFSET_X  = BOARD_PADDING+PIECE_SIZE/2;
var PIECE_APPEAR_ANIMATION = {
  // loop: true,
  tweens: [
    ['to', {rotation:360}, 500],
    ['set', {rotation:0}],
  ]
};

var score_time = 0;

//配列
var play_score = [];

//ローカルストレージ読み込み
var get_score = localStorage.getItem('touch_numbers_score');

//ローカルストレージの中身がある時のみ配列を再現
if( get_score != null){
  play_score = JSON.parse(get_score);
}


phina.define("MainScene", {
  superClass: 'DisplayScene',

  init: function() {
    this.superInit({
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
    });

    this.currentIndex = 1;
    this.backgroundColor = 'lemonchiffon';

    this.group = DisplayElement().addChildTo(this);

    var gridX = Grid(BOARD_SIZE, 5);
    var gridY = Grid(BOARD_SIZE, 5);

    var self = this;

    var numbers = Array.range(1, MAX_NUM+1).shuffle();

    numbers.each(function(index, i) {
      // グリッド上でのインデックス
      var xIndex = i%MAX_PER_LINE;
      var yIndex = Math.floor(i/MAX_PER_LINE);
      var p = Piece(index).addChildTo(self.group);

      p.x = gridX.span(xIndex)+BOARD_OFFSET_X;
      p.y = gridY.span(yIndex+1)+150;

      p.onpointstart = function() {
        self.check(this);
      };
      p.appear();
    });

    // タイマーラベルを生成
    var timerLabel = Label('0').addChildTo(this);
    timerLabel.origin.x = 1;
    timerLabel.x = 580;
    timerLabel.y = 130;
    timerLabel.fill = '#444';
    timerLabel.fontSize = 100;
    // timerLabel.align = 'right';
    timerLabel.baseline = 'bottom';
    this.timerLabel = timerLabel;

    this.time = 0;

    this.onpointstart = function(e) {
      var p = e.pointer;
      var wave = Wave().addChildTo(this);
      wave.x = p.x;
      wave.y = p.y;
    };
  },

  onenter: function() {
    var scene = CountScene({
      backgroundColor: 'rgba(100, 100, 100, 1)',
      count: ['Ready'],
      fontSize: 100,
    });
    this.app.pushScene(scene);
  },

  update: function(app) {
    // タイマーを更新
    this.time += app.ticker.deltaTime;
    var sec = this.time/1000; // 秒数に変換
    this.timerLabel.text = sec.toFixed(3);
    score_time = this.timerLabel.text;
  },

  check: function(piece) {
    if (this.currentIndex === piece.index) {
      piece.alpha = 0.5;

      if (this.currentIndex >= MAX_NUM) {
        this.exit({
          score: score_time,
        });
        //配列にscoreを追加
        play_score.push(score_time);
        //ローカルストレージに保存
        var set_score = JSON.stringify(play_score);
        localStorage.setItem('touch_numbers_score', set_score);
      }
      else {
        this.currentIndex += 1;
      }
    }
  }

});

phina.define('Piece', {
  superClass: 'Button',

  init: function(index) {
    this.superInit({
      width: PIECE_SIZE,
      height: PIECE_SIZE,
      text: index+'',
    });

    this.index = index;
  },

  appear: function() {
    this.tweener
      .clear()
      .fromJSON(PIECE_APPEAR_ANIMATION);
  },
});


phina.main(function() {
  var app = GameApp({
    startLabel: location.search.substr(1).toObject().scene || 'title',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    startLabel: 'title',
    backgroundColor: "pink",
  });

  app.run();
});

