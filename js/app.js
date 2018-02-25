// 游戏参数
var game = {

    // 图片素材地址
    imgUrl : [
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/Selector.png'
    ],

    // 角色序号
    charNum : 1,

    // 横纵单位长度
    xUnit : 101,
    yUnit : 83,

    // 玩家及敌人位置（y轴）修正值
    playerOffset : -10,
    enemyOffset : -20,

    // 游戏环节：开始前 游戏中 选择角色 成功 失败 结束
    process : {
        before : false,
        during : false,
        selecting : true,
        win : false,
        fail : false,
        after : false
    }
};

// 游戏环节变更
game.procSet = function(proc){
    for( var p in this.process) { this.process[p] = false; }
    if(this.process[proc] !== undefined) this.process[proc] = true;
}
// 游戏环节进程
game.procShow = function(){
	for( var p in this.process) {
	    if(this.process[p]) return p;
    }
}

// 游戏初始化
game.init = function() {
    this.procSet('before');
    this.beforePage.style.display = 'flex';
}
// 游戏开始
game.start = function() {
    this.procSet('selecting');
    this.beforePage.style.display = 'none';
    this.afterPage.style.display = 'none';
    this.duringPage.style.display = 'block';
    this.score.innerHTML = game.score.value = 0;
}
// 角色选定
game.charSele = function(){
    this.procSet('during');
    player = new Player(2, 5, game.charNum);
}

// 游戏成功
game.gameWin = function() {
    this.procSet('win');
    this.score.innerHTML = game.score.value += 1;
    player.reset();
    this.procSet('during');
};
// 游戏失败
game.gameFail = function() {
    this.procSet('fail');
    this.score.innerHTML = game.score.value -= 1;
    if(game.score.value>=0) {
	    player.reset();
        this.procSet('during');
    } else {
        this.gameOver();
    }
}
// 游戏结束
game.gameOver = function() {
    this.procSet('after');
    this.finalScore.innerHTML = this.score.value;
    this.duringPage.style.display = 'none';
    this.afterPage.style.display = 'flex';
}
// 游戏操作
game.handleInput = function(key){
    switch(game.procShow()){
        case 'before':
		  break;
		case 'selecting':
		  player.handleInputSelect(key);
		  break;
		case 'during':
		  player.handleInputgame(key);
		  break;
		 default:
		   {}
	}
}

// 游戏DOM对象
game.beforePage = document.getElementsByClassName('before-game')[0];
game.duringPage = document.getElementsByClassName('during-game')[0];
game.afterPage = document.getElementsByClassName('after-game')[0];
game.startBtn = document.getElementsByClassName('start')[0];
game.restartBtn = document.getElementsByClassName('restart')[0];
game.score = document.getElementsByClassName('score')[0].getElementsByTagName('span')[0];
game.score.value = 0;
game.finalScore = game.afterPage.getElementsByTagName('h1')[0];

game.startBtn.addEventListener('click', function(){
    game.start();
});
game.restartBtn.addEventListener('click', function(){
    game.start();
});

// 这是我们的玩家要躲避的敌人 
var Enemy = function() {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多

    // 敌人的图片，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = game.imgUrl[0];
	this.reset();
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    (this.x / game.xUnit < 6) ? (this.x += dt * this.speed) : this.reset();

};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// 判定敌人是否与玩家碰撞
Enemy.prototype.impact = function() {
    if((this.y - game.enemyOffset == player.y - game.playerOffset) && (Math.abs(this.x - player.x) < game.xUnit / 2) && (!game.process.fail) ) {
        setTimeout(function(){game.gameFail()}, 10);
    }
}
// 设置敌人随机值
Enemy.prototype.reset = function(){
    this.col = -2 * Math.random();
    this.row = Math.floor(4 * Math.random() + 1);
    this.speed = 500 * Math.random() + 200;
	this.x = this.col * game.xUnit;
	this.y = this.row * game.yUnit + game.enemyOffset;
}

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
var Player = function(col, row, char) {
    this.sprite = game.imgUrl[char];
	this.col = col;
	this.row = row;
	this.reset();
}
Player.prototype.update = function() {
    if((this.y - game.playerOffset) / game.yUnit == 0 && !game.process.win) {
        setTimeout(function(){game.gameWin()}, 10)
    }
};
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// 控制玩家移动（选人环节）
Player.prototype.handleInputSelect = function(key) {
    switch(key)
    {
    case 'left':
      if(player5.x > 2 * game.xUnit) {
        allPlayers.forEach(function(player){player.x -= game.xUnit;});
        game.charNum += 1;
      }
      break;
    case 'right':
      if(player1.x < 2 * game.xUnit){
        allPlayers.forEach(function(player){player.x += game.xUnit;});
        game.charNum -= 1;
      }
      break;
    case 'enter':
    case 'space':
      game.charSele();
      break;
    default:
      {}
    }
};
// 控制玩家移动（游戏环节）
Player.prototype.handleInputgame = function(key) {
    switch(key)
    {
    case 'up':
      ((this.y - game.playerOffset) / game.yUnit >= 1 ) ? (this.y -= game.yUnit) : false; break;
    case 'down':
      ((this.y - game.playerOffset) / game.yUnit <= 4 ) ? (this.y += game.yUnit) : false; break;
    case 'left':
      (this.x / game.xUnit >= 1 ) ? (this.x -= game.xUnit) : false; break;
    case 'right':
      (this.x / game.xUnit <= 3 ) ? (this.x += game.xUnit) : false; break;
    default:
      {}
    }
};
//重置玩家位置
Player.prototype.reset = function() {
    this.x = this.col * game.xUnit;
    this.y = this.row * game.yUnit + game.playerOffset;
}

// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面
var enemy1 = new Enemy();
var enemy2 = new Enemy();
var enemy3 = new Enemy();
var enemy4 = new Enemy();
var allEnemies = [enemy1, enemy2, enemy3, enemy4];

var player1 = new Player(2, 5, 1);
var player2 = new Player(3, 5, 2);
var player3 = new Player(4, 5, 3);
var player4 = new Player(5, 5, 4);
var player5 = new Player(6, 5, 5);
var selectBox = new Player(2, 5, 6);
var allPlayers = [player1, player2, player3, player4, player5];
var player = player1;

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Player.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        65: 'left',
        87: 'up',
        68: 'right',
        83: 'down',
        13: 'enter',
        32: 'space'
    };

    game.handleInput(allowedKeys[e.keyCode]);

});
