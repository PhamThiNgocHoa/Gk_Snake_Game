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
    constructor(unitSize, gameBoardWidth, gameBoardHeight, snake, barrier) {
        this.unitSize = unitSize;
        this.gameBoardWidth = gameBoardWidth;
        this.gameBoardHeight = gameBoardHeight;
        this.foodObject = {};
        this.snake = snake; // Lưu đối tượng con rắn
        this.barrier = barrier; // Lưu đối tượng chướng ngại vật
    }



    createFood() {
        let newFood;
        do {
            var x = Math.floor(Math.random() * ((this.gameBoardWidth - this.unitSize) / this.unitSize)) * this.unitSize;
            var y = Math.floor(Math.random() * ((this.gameBoardHeight - this.unitSize) / this.unitSize)) * this.unitSize;
            newFood = { x, y };
        } while (this.isFoodOnSnake(newFood, this.snake.snake) || this.isFoodOnBarrier(newFood, this.barrier.barriers)); // Check for collision with both snake and barriers
        this.foodObject = newFood;
    }

    isFoodOnBarrier(food, barriers) {
        for (let i = 0; i < barriers.length; i++) {
            if (barriers[i].x === food.x && barriers[i].y === food.y) {
                return true;
            }
        }
        return false;
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
    constructor(unitSize, gameBoardWidth, gameBoardHeight, snake) {
        this.unitSize = unitSize;
        this.gameBoardWidth = gameBoardWidth;
        this.gameBoardHeight = gameBoardHeight;
        this.barriers = []; // Danh sách các chướng ngại vật
        this.snake = snake; // Truyền vào đối tượng snake
        this.boom = [];
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

    createBoom() {
        for (let i = 0; i < 8; i++) {
            let x, y;
            do {
                x = Math.floor(Math.random() * ((this.gameBoardWidth - this.unitSize) / this.unitSize)) * this.unitSize;
                y = Math.floor(Math.random() * ((this.gameBoardHeight - this.unitSize) / this.unitSize)) * this.unitSize;
            } while (this.isBarrierCollidedWithSnake({ x, y }));
            this.boom.push({ x, y });
        }
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
        this.barrier = new Barrier(this.unitSize, this.gameBoard.width, this.gameBoard.height, this.snake); // Tạo đối tượng Barrier trước
        this.food = new Food(this.unitSize, this.gameBoard.width, this.gameBoard.height, this.snake, this.barrier); // Truyền đối tượng Snake và Barrier vào Food
        this.setupEventListeners();
        this.paused = false;
        this.start();
    }

//21130381 Nguyen Thanh Huy
//Chuc nang Pause

    pauseGame(){
        document.getElementById("paus").addEventListener("click", () => {
            game.pause();
        });
    }
//5.5.2 Game xac nhan nut pause da duoc nhan
    pause() {
        this.paused = true;
    }
//5.5.3 chuyen trang thai game thanh pause nen man hinh game dung im
    checkClickContinue(){
        document.getElementById("continue").addEventListener("click", () => {
            game.resume();
        });
    }
//sau do, nguoi choi co the nhan resume
    resume() {
        this.paused = false;
        this.nextTick();
    }

    nextTick() {
        if (!this.paused && this.running) {
            this.level();
        }
    }

    level() {
        if(this.score <=5){
            setTimeout(() => {
                this.clearGameBoard();
                this.drawFood();
                this.moveSnake();
                this.drawSnake();
                this.drawBarrier();
                this.checkBarrierCollision();
                this.checkCollision();
                this.nextTick();
            }, 370);
        }
        else if(this.score >5 && this.score <=10){
            setTimeout(() => {
                this.clearGameBoard();
                this.drawFood();
                this.moveSnake();
                this.drawSnake();
                this.drawBarrier();
                this.checkBarrierCollision();
                this.checkCollision();
                this.nextTick();
            }, 350);
        }
        else if(this.score >10 && this.score <=15){
            setTimeout(() => {
                this.clearGameBoard();
                this.drawFood();
                this.moveSnake();
                this.drawSnake();
                this.drawBarrier();
                this.checkBarrierCollision();
                this.checkCollision();
                this.nextTick();
            }, 300);
        }
        else if(this.score >15 && this.score <=20){
            setTimeout(() => {
                this.clearGameBoard();
                this.drawFood();
                this.moveSnake();
                this.drawSnake();
                this.drawBarrier();
                this.checkBarrierCollision();
                this.checkCollision();
                this.nextTick();
            }, 250);
        }
    }

    setupEventListeners() {
        document.addEventListener("DOMContentLoaded", () => {
            document.addEventListener("keydown", (e) => {
                this.changeDirection(e.key);
            });
        });
    }

    //Long
    // hàm thay đổi hướng di chuyển của con rắn dựa trên phím bấm từ người chơi
    // 5.5.2 Người chơi nhấn các nút Up, Down, Left, Right.
    changeDirection(direction) {
        var key = direction;
    // 5.5.3 Hệ thống xác nhận trạng thái và xác định hướng con rắn sẽ đổi.
        // kiểm tra xem con rắn có di chuyển lên xuống trái phải được không
        var goingUp = this.ySpeed === -this.unitSize;
        var goingDown = this.ySpeed === this.unitSize;
        var goingLeft = this.xSpeed === -this.unitSize;
        var goingRight = this.xSpeed === this.unitSize;
    // 5.5.4 Nếu con rắn đang di chuyển theo hướng trước đó thì sẽ chuyển sang hướng tương ứng đã chọn.
    // nếu người chơi nhấn nút trùng với hướng của con rắn đang move thì không có gì xảy ra
	// nếu người chơi nhấn những nút còn lại thì con rắn sẽ đổi hướng theo nút đó
        if (key === "ArrowUp" && !goingDown) {
            this.xSpeed = 0;
            this.ySpeed = -this.unitSize;
        }
        if (key === "ArrowDown" && !goingUp) {
            this.xSpeed = 0;
            this.ySpeed = this.unitSize;
        }
        if (key === "ArrowLeft" && !goingRight) {
            this.xSpeed = -this.unitSize;
            this.ySpeed = 0;
        }
        if (key === "ArrowRight" && !goingLeft) {
            this.xSpeed = this.unitSize;
            this.ySpeed = 0;
        }
    }
    // 5.5.5 Kết thúc.


    start() {
        this.food.createFood();
        this.barrier.createBoom(); // Thêm lệnh này để tạo ra các nấm
        this.drawFood();
        this.drawSnake();
        this.pauseGame();
        this.checkClickContinue();
        this.nextTick();

    }

    drawFood() {
        this.ctx.beginPath();
        this.ctx.arc(this.food.foodObject.x + this.unitSize / 2, this.food.foodObject.y + this.unitSize / 2, this.unitSize / 2, 0, Math.PI * 2);
        this.ctx.fillStyle = '#8e09ba';
        this.ctx.fill();
        this.ctx.closePath();
    }
    drawBarrier() {
        this.barrier.draw(this.ctx);
    }
    drawSnake() {
        this.snake.draw(this.ctx);
    }

    drawBoom() {
        for (var i = 0; i < this.barrier.boom.length; i++) {
            var mushroomImage = new Image();
            mushroomImage.src = 'Boom.png'; // Đường dẫn của hình ảnh nấm

            // Lưu trữ giá trị của i trong một biến trung gian để sử dụng trong hàm onload
            var index = i;

            // Chờ cho hình ảnh được tải trước khi vẽ
            if (mushroomImage.complete) {
                this.ctx.drawImage(mushroomImage, this.barrier.boom[index].x, this.barrier.boom[index].y, this.unitSize, this.unitSize);
            } else {
                // Nếu hình ảnh chưa được tải, bạn có thể thực hiện vẽ khi nó được tải xong
                mushroomImage.onload = function() {
                    this.ctx.drawImage(mushroomImage, this.barrier.boom[index].x, this.barrier.boom[index].y, this.unitSize, this.unitSize);
                }.bind(this); // Sử dụng bind để đảm bảo rằng "this" ở đây đề cập đến đối tượng Game
            }
        }
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


    checkBarrierCollision() {
        const head = this.snake.snake[0];

        // Kiểm tra xem đầu của con rắn có chạm vào bất kỳ chướng ngại vật nào hay không
        for (let i = 0; i < this.barrier.barriers.length; i++) {
            if (head.x === this.barrier.barriers[i].x && head.y === this.barrier.barriers[i].y) {
                this.running = false;
                this.displayGameOver();
                return;
            }
        }
    }


    checkSnakeOnBoom(){
        const head = this.snake.snake[0];
        for (let i = 0; i < this.barrier.boom.length; i++) {
            if (head.x === this.barrier.boom[i].x && head.y === this.barrier.boom[i].y) {
                // Loại bỏ nửa phần đuôi của con rắn
                const halfSnakeLength = Math.floor(this.snake.snake.length / 2);
                for (let j = 0; j < halfSnakeLength; j++) {
                    this.snake.snake.pop();
                }

                // Kiểm tra độ dài của con rắn
                if (this.snake.snake.length < 5) { // Giả sử độ dài ban đầu của con rắn là 5
                    // Game over
                    this.running = false;
                    this.displayGameOver();
                }

                break; // Kết thúc vòng lặp khi tìm thấy va chạm
            }
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
}

// Bắt đầu trò chơi
const game = new Game();



$(document).ready(function(){
    $('#intrusct').click(function(){
        $('#popup').css('display', 'block');
    });

    $('.fa-x').click(function(){
        $('#popup').css('display', 'none');
    });
});



$(document).ready(function (){

    $("#start").click(function (){
        localStorage.setItem('start1Visible', 'true'); // Lưu trạng thái của #start1 vào localStorage
        localStorage.setItem('selectVisible', 'false');
        location.reload();
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



