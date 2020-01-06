function ScoreBoard() {
	const board = {}

	board.load = function(px) {
		board.x = px;
		board.y = 50;
		board.color = '#fb2eeb';
		board.size = 50;
		board.score = 0;
	}

	board.draw = function() {
		push();
		textAlign(CENTER);
		textSize(board.size);
		fill(board.color);
		text(board.score, board.x, board.y);
		pop();
	}

	return board;
}

const net = {
	load: function() {
		this.x = width / 2;
		this.y = 0;
		this.w = 5;
		this.h = height;
		this.color = '#fb2eeb';
	},

	draw: function() {
		push();
		rectMode(CORNER);
		fill(this.color);
		rect(this.x, this.y, this.w, this.h);
		pop();
	}
}

function Pad() {
	const pad = {};

	pad.load = function(px) {
		pad.x = px;
		pad.y = height / 2;
		pad.color = '#06fdff';
		pad.w = 10;
		pad.h = 50;
		pad.vy = 4;
	}

	pad.setControls = function(key1, key2) {
		pad.controls = {
			up: key1, 
			down: key2
		};
	}

	pad.moveUp = function() {
		pad.y -= pad.vy * (deltaTime/10);
	}

	pad.moveDown = function() {
		pad.y += pad.vy * (deltaTime/10);
	}

	pad.bottomBorderStop = function() {
		if (pad.y >= height - pad.h/2) {
			pad.y = height - pad.h/2;
		} 
	}

	pad.topBorderStop = function() {
		if (pad.y <= pad.h/2) {
			pad.y = pad.h/2;
		} 
	}

	pad.update = function() {
		if (keyIsDown(pad.controls.up)) {
			pad.moveUp();
		} else if (keyIsDown(pad.controls.down)) {
			pad.moveDown();
		}

		pad.bottomBorderStop();
		pad.topBorderStop();
	}

	pad.draw = function() {
		push();
		rectMode(CENTER);
		fill(pad.color);
		rect(pad.x, pad.y, pad.w, pad.h);
		pop();
	}

	return pad;
}

function Ball() {
	const ball = {};

	ball.load = function() {
		ball.x = width / 2;
		ball.y = height / 2;
		ball.radius = 6;
		ball.color = '#fefe4e';
		ball.vx = 4;
		ball.vy = 4;
		ball.direction = 1;
	}

	ball.reset = function() {
		ball.x = width / 2;
		ball.y = height / 2;
	}

	ball.faster = function() {
		ball.vx++;
		ball.vy++;
	}

	ball.bottomBorderBounce = function() {
		if (ball.y >= height - ball.radius) {
			ball.y = height - ball.radius;
			ball.vy = 0 - ball.vy;
		} 
	}

	ball.topBorderBounce = function() {
		if (ball.y <= ball.radius) {
			ball.y = ball.radius;
			ball.vy = 0 - ball.vy;
		} 
	}

	ball.rightPadCollide = function(pad) {
		if (ball.x >= (pad.x - pad.w/2 - ball.radius) &&
			/*Checking if ball is on the FRONT side of the pad and not behind*/
			ball.x < (pad.x + pad.w/2 - ball.radius) &&
			ball.y >= (pad.y - pad.h/2) &&
			ball.y <= (pad.y + pad.h/2)) {
			
			ball.x -= 1;
			ball.vx = 0 - ball.vx;
			ball.faster();
		}
	}

	ball.leftPadCollide = function(pad) {
		if (ball.x <= (pad.x + pad.w/2 + ball.radius) &&
			/*Checking if ball is on the FRONT side of the pad and not behind*/
			ball.x > (pad.x - pad.w/2 + ball.radius) &&
			ball.y >= (pad.y - pad.h/2) &&
			ball.y <= (pad.y + pad.h/2)) {

			ball.x += 1;
			ball.vx = 0 - ball.vx;
			ball.faster();
		}
	}

	ball.serveRight = function() {
		ball.direction = 1;
	}

	ball.serveLeft = function() {
		ball.direction = -1;
	}

	ball.update = function(scoreBoardLeft, scoreBoardRight, padLeft, padRight) {
		ball.x += ball.direction * ball.vx * (deltaTime / 30);
		ball.y += ball.direction * ball.vy * (deltaTime / 30);

		ball.rightPadCollide(padRight);
		ball.leftPadCollide(padLeft);
		ball.bottomBorderBounce();
		ball.topBorderBounce();

		if (ball.x > width) {
			scoreBoardLeft.score++;
			ball.serveRight();
			ball.reset();

		} else if (ball.x < 0) {
			scoreBoardRight.score++;
			ball.serveLeft();
			ball.reset();
		}
	}

	ball.draw = function() {
		push();
		fill(ball.color);
		circle(ball.x, ball.y, ball.radius*2);
		pop();
	}

	return ball;
}

let scoreBoard1 = ScoreBoard();
let scoreBoard2 = ScoreBoard();
const ball = Ball();
const pad1 = Pad();
const pad2 = Pad();

function setup() {
	createCanvas(800, 400);
	background('#1b002a');
	noStroke();

	/*Loading left score board at 40px on the X axis*/
	scoreBoard1.load(40);
	/*Loading right score board at 760px on the X axis*/
	scoreBoard2.load(width - 40);

	ball.load();

	/*Loading left pad at 100px on the X axis*/
	pad1.load(100);
	/*Left pad is controlled with the z and s keyboard keys*/
	pad1.setControls(asciiCodeKeyboard['z'], asciiCodeKeyboard['s']);

	/*Loading right pad at 700px on the X axis*/
	pad2.load(width - 100);
	/*Right pad is controlled with the up and down arrow*/
	pad2.setControls(UP_ARROW, DOWN_ARROW);

	/*Loading the net, offering a graphic separation of the game screen*/
	net.load();
}

function draw() {
	background('#1b002a');

	scoreBoard1.draw();
	scoreBoard2.draw();

	ball.update(scoreBoard1, scoreBoard2, pad1, pad2);

	pad1.update();
	pad2.update();

	net.draw();
	ball.draw()
	pad1.draw();
	pad2.draw();
}