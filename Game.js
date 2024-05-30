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



class Food {
    constructor(unitSize, gameBoardWidth, gameBoardHeight, snake) {
        this.unitSize = unitSize;
        this.gameBoardWidth = gameBoardWidth;
        this.gameBoardHeight = gameBoardHeight;
        this.foodObject = {};
        this.snake = snake; // Lưu đối tượng con rắn
    }

    createFood() {
        let newFood;
        do {
            var x = Math.floor(Math.random() * ((this.gameBoardWidth - this.unitSize) / this.unitSize)) * this.unitSize;
            var y = Math.floor(Math.random() * ((this.gameBoardHeight - this.unitSize) / this.unitSize)) * this.unitSize;
            newFood = { x, y };
        } while (this.isFoodOnSnake(newFood, this.snake.snake)); // Truyền mảng đối tượng con rắn vào hàm kiểm tra
        this.foodObject = newFood;
    }

    isFoodOnSnake(food, snake) {
        for (var i = 0; i < snake.length; i++) {
            if (snake[i].x === food.x && snake[i].y === food.y) {
                return true;
            }
        }
        return false;
    }


}

class Barrier {
    constructor(unitSize, gameBoardWidth, gameBoardHeight, snake, food) {
        this.unitSize = unitSize;
        this.gameBoardWidth = gameBoardWidth;
        this.gameBoardHeight = gameBoardHeight;
        this.barriers = []; // Danh sách các chướng ngại vật
        this.snake = snake; // Truyền vào đối tượng snake
        this.food = food; // Truyền vào đối tượng food
        // this.boom = [];
        this.createBarriers(); // Khởi tạo các chướng ngại vật ban đầu
    }

    createBarriers() {
        for (let i = 0; i < 15; i++) {
            let x, y;
            do {
                x = Math.floor(Math.random() * ((this.gameBoardWidth - this.unitSize) / this.unitSize)) * this.unitSize;
                y = Math.floor(Math.random() * ((this.gameBoardHeight - this.unitSize) / this.unitSize)) * this.unitSize;
            } while (this.isBarrierCollidedWithSnake({ x, y })); // Kiểm tra xem vị trí mới của chướng ngại vật có trùng với con rắn không
            this.barriers.push({ x, y });
        }
    }

    isBarrierCollidedWithSnake(barrier) {
        // Kiểm tra xem vị trí mới của chướng ngại vật có trùng với các phần của rắn không
        for (let i = 0; i < this.snake.snake.length; i++) {
            if (barrier.x === this.snake.snake[i].x && barrier.y === this.snake.snake[i].y) {
                return true;
            }
        }
        return false;
    }

    draw(ctx) {
        ctx.fillStyle = 'red';
        for (let i = 0; i < this.barriers.length; i++) {
            ctx.fillRect(this.barriers[i].x, this.barriers[i].y, this.unitSize, this.unitSize);
        }
    }

    // createBoom() {
    //     for (let i = 0; i < 8; i++) {
    //         let x, y;
    //         do {
    //             x = Math.floor(Math.random() * ((this.gameBoardWidth - this.unitSize) / this.unitSize)) * this.unitSize;
    //             y = Math.floor(Math.random() * ((this.gameBoardHeight - this.unitSize) / this.unitSize)) * this.unitSize;
    //         } while (this.isBarrierCollidedWithSnake({ x, y }));
    //         this.boom.push({ x, y });
    //     }
    // }
}



class Game {
//Huynh Ho Lam
// Bắt đầu trò chơi - NewGame branch
//-	New game là use case dùng để khởi động trò chơi dưới sự tương tác của người chơi.
// Khi trò chơi hoạt động hệ thống sẽ luôn cho hiện ra một Pop Up cho phép người chơi
// nhấn vào button New game ngay trong Pop Up để khởi tạo lại màn trò chơi tùy vaò nhu cầu người chơi

//5.5.1 Khởi động trò chơi
    constructor() {
        this.gameBoard = document.getElementById("board");
        this.ctx = this.gameBoard.getContext("2d");
        this.unitSize = 20;
        this.xSpeed = this.unitSize;
        this.score = 0;
        this.running = true;
        this.ySpeed = 0;
        this.snake = new Snake(this.unitSize); // Tạo đối tượng Snake
        this.barrier = new Barrier(this.unitSize, this.gameBoard.width, this.gameBoard.height, this.snake); // Tạo đối tượng Barrier trước
        this.food = new Food(this.unitSize, this.gameBoard.width, this.gameBoard.height, this.snake, this.barrier); // Truyền đối tượng Snake và Barrier vào Food
        this.setupEventListeners();
        this.setupEventNewGame();
        this.paused = false;
        this.start();
    }
//5.5.2 Tiến hành hoạt động chơi game
//5.5.3 Luôn hiện button NewGame
//5.5.4 Nhấn vào NewGame bất kì lúc nào
    // Vì newgame cũng tương tự là resetgame, hệ thống sẽ làm mới lại các thống số như ban đầu....
    resetGame() {
        // Reset all game elements
        this.snake = new Snake(this.unitSize); // Tạo đối tượng Snake mới
        // Đặt lại các biến trạng thái khác
        this.score = 0;// Đặt điểm về 0
        this.running = true;// Đặt trạng thái chạy lại thành true
        this.paused = false; // Đảm bảo rằng trạng thái tạm dừng được thiết lập lại
        // Đặt lại hướng di chuyển của con rắn
        this.xSpeed = this.unitSize;
        this.ySpeed = 0;
        // Xóa bảng trò chơi để vẽ lại từ đầu
        this.clearGameBoard();
        // Bắt đầu trò chơi mới
        this.start();
    }

//5.5.5 Hệ thống khởi tạo trò chơi mọi lúc
    setupEventNewGame() {
        document.addEventListener("DOMContentLoaded", () => {
            document.getElementById("start").addEventListener("click", () => {
                this.resetGame(); // Gọi resetGame khi nhấn vào button newGame
            });

        });
    }
//5.5.6 Kết thúc usecase

    start() {
        this.drawSnake();
        this.food.createFood();
        this.drawFood();
        this.checkClickContinue();
        this.pauseGame();
        this.nextTick();

    }
    drawFood() {
        this.ctx.beginPath();
        this.ctx.arc(this.food.foodObject.x + this.unitSize / 2, this.food.foodObject.y + this.unitSize / 2, this.unitSize / 2, 0, Math.PI * 2);
        this.ctx.fillStyle = '#8e09ba';
        this.ctx.fill();
        this.ctx.closePath();
    }
    drawSnake() {
        this.snake.draw(this.ctx);
    }
    moveSnake() {
        this.snake.move(this.xSpeed, this.ySpeed);

        // Kiểm tra xem con rắn có ăn thức ăn không
        if (this.snake.snake[0].x === this.food.foodObject.x && this.snake.snake[0].y === this.food.foodObject.y) {
            this.score++;
            document.getElementById("score").innerText = this.score;
            this.food.createFood();
            this.snake.grow(); // Thêm phần đuôi của con rắn
        }
    }
    checkCollision() {
        this.snake.checkCollision(this.gameBoard.width, this.gameBoard.height);
        if (this.snake.collided) {
            this.running = false;
            this.displayGameOver();
        }
    }

    pauseGame(){
        document.getElementById("paus").addEventListener("click", () => {
            game.pause();
        });
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
                this.drawFood();
                this.moveSnake();
                this.drawSnake();
                this.checkCollision();
                this.nextTick();
            }, 370);
        } else if (this.score > 5 && this.score <= 10) {
            setTimeout(() => {
                this.clearGameBoard();
                this.drawFood();
                this.moveSnake();
                this.drawSnake();
                this.drawBarrier();
                this.checkCollision();
                this.nextTick();
                this.nextTick();
            }, 350);
        }
    }
    drawBarrier() {
        this.barrier.draw(this.ctx);
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
}


const game = new Game();
$(document).ready(function (){
    $("#start").click(function (){
    });

    $("#intrusct").click(function () {
        $("#popup").css({  "opacity": "1", "pointer-events": "all"});
    });

    $("#popup").click(function () {
        $("#popup").css({  "opacity": "0", "pointer-events": "none"});
    });

    $(".fa-solid").click(function () {
        $("#popup").css({  "opacity": "0", "pointer-events": "none"});
    });
});

$(document).ready(function(){
    $('#intrusct').click(function(){
        $('#popup').css('display', 'block');
    });

    $('.fa-x').click(function(){
        $('#popup').css('display', 'none');
    });
});
