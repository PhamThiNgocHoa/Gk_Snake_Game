class Snake {
    constructor(unitSize) {
        this.unitSize = unitSize;
        this.snake = [
            {x: this.unitSize*4, y: 0},
            {x: this.unitSize*3, y: 0},
            {x: this.unitSize*2, y: 0},
            {x: this.unitSize, y: 0},
            {x: 0, y: 0},
        ];
        this.collided = false;
    }

    draw(ctx) {
        ctx.fillStyle='yellow';
        ctx.strokeStyle ='black';
        ctx.fillRect(this.snake[0].x, this.snake[0].y, this.unitSize,  this.unitSize);
        ctx.strokeRect(this.snake[0].x, this.snake[0].y, this.unitSize,  this.unitSize);
        ctx.fillStyle='green';
        for (var i = 1; i < this.snake.length; i++) {
            ctx.fillRect(this.snake[i].x, this.snake[i].y, this.unitSize,  this.unitSize);
            ctx.strokeRect(this.snake[i].x, this.snake[i].y, this.unitSize,  this.unitSize);
        }
    }

    move(xSpeed, ySpeed) {
        // Lưu vị trí của đầu rắn
        const head = {
            x: this.snake[0].x + xSpeed,
            y: this.snake[0].y + ySpeed
        };

        // Thêm đầu mới vào đầu của mảng snake
        this.snake.unshift(head);

        // Xóa phần đuôi của con rắn
        this.snake.pop();
    }

    // Kiểm tra va chạm với tường hoặc với chính nó
    checkCollision(width, height) {
        const head = this.snake[0];

        // Kiểm tra va chạm với tường
        if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height) {
            this.collided = true;
            return;
        }

        // Kiểm tra va chạm với chính nó
        for (let i = 1; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                this.collided = true;
                return;
            }
        }

        this.collided = false;
    }

    // Thêm phần đuôi khi ăn thức ăn
    grow() {
        const tail = this.snake[this.snake.length - 1];
        this.snake.push({ x: tail.x, y: tail.y });
    }
}



class Game {
    constructor() {
        this.gameBoard = document.getElementById("board");
        this.ctx = this.gameBoard.getContext("2d");
        this.unitSize = 20;
        this.xSpeed = this.unitSize;
        this.score = 0;
        this.running = true;
        this.ySpeed = 0;
        this.snake = new Snake(this.unitSize); // Tạo đối tượng Snake trước
        this.paused = false;
        this.start();
    }

    start() {
        this.drawSnake();
        this.checkClickContinue();
        this.nextTick();

    }
    drawSnake() {
        this.snake.draw(this.ctx);
    }
    moveSnake() {
        this.snake.move(this.xSpeed, this.ySpeed);

        // // Kiểm tra xem con rắn có ăn thức ăn không
        // if (this.snake.snake[0].x === this.food.foodObject.x && this.snake.snake[0].y === this.food.foodObject.y) {
        //     this.score++;
        //     document.getElementById("score").innerText = this.score;
        //     this.food.createFood();
        //     this.snake.grow(); // Thêm phần đuôi của con rắn
        // }
    }
    checkCollision() {
        this.snake.checkCollision(this.gameBoard.width, this.gameBoard.height);
        if (this.snake.collided) {
            this.running = false;
            this.displayGameOver();
        }
    }

    displayGameOver() {
        this.ctx.font = "30px MV Boli";
        this.ctx.fillStyle = "Black";
        this.ctx.textAlign = "center";
        this.ctx.fillText("GAME OVER!", this.gameBoard.width / 2, this.gameBoard.height / 2);
    }

    clearGameBoard() {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.gameBoard.width, this.gameBoard.height);
    }

//  21130359 - Phạm Thị Ngọc Hòa
//5.5.0	Game Pause.
    pause() {
        this.paused = true;
    }

    //  5.5.2	Hệ thống xác nhận có đúng là nút Continue đã được Player nhấn vào hay chưa.
    checkClickContinue() {
        document.getElementById("continue").addEventListener("click", () => {
            game.resume();
        });
    }

//5.5.3	Nếu Player đã nhấn vào nút Continue thì hệ thống chuyển trạng thái của Snake đang đứng yên sang trạng thái tiếp tục di chuyển trên màn hình.
    resume() {
        this.paused = false;
        this.nextTick();
    }

    //5.5.4	Hệ thống tiếp tục thực thi các level tiếp theo sẽ diễn ra.
    nextTick() {
        if (!this.paused && this.running) {
            this.level();
        }
    }

//5.5.4	Hệ thống tiếp tục thực thi các level tiếp theo sẽ diễn ra.
    level() {

        if (this.score <= 5) {
            setTimeout(() => {
                this.clearGameBoard();
                this.moveSnake();
                this.drawSnake();
                this.checkCollision();
                this.nextTick();
            }, 370);
        } else if (this.score > 5 && this.score <= 10) {
            setTimeout(() => {
                this.clearGameBoard();
                this.moveSnake();
                this.drawSnake();
                this.checkCollision();
                this.nextTick();
                this.nextTick();
            }, 350);
        }
    }
}

// Bắt đầu trò chơi
const game = new Game();
