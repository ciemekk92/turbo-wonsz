import {
    SnakeSegmentCoord,
    Point,
    DIRECTION,
    GAME_SPEED,
    INITIAL_SNAKE_SIZE,
    DIRECTIONS,
    SNAKE_COLOR,
    POINT_COLOR,
} from './fixtures';
import { UI } from './UI';

export class Game {
    userInterface: UI;
    snake: SnakeSegmentCoord[] = [];
    timer: ReturnType<typeof setInterval> | null = null;
    point: Point = { x: 0, y: 0 };
    score: number = 0;
    isChangingDirection: boolean = false;
    currentDirection: DIRECTION = DIRECTION.RIGHT;

    constructor(userInterface: UI) {
        this.userInterface = userInterface;
        this.init();

        this.userInterface.bindHandlers(this.changeDirection, this.quit, this.start);

        this.userInterface.render();
    }

    init = () => {
        this.snake = [];
        this.point = { x: 0, y: 0 };
        this.score = 0;
    };

    createPoint = () => {
        this.point.x = this.generateRandomCoord(0, this.userInterface.gameContainer.width - 1);
        this.point.y = this.generateRandomCoord(1, this.userInterface.gameContainer.height - 1);

        this.snake.forEach((segment: SnakeSegmentCoord) => {
            if (segment.x === this.point.x && segment.y === this.point.y) {
                this.createPoint();
            }
        });
    };

    generateRandomCoord = (min: number, max: number) => {
        return Math.round(Math.random() * (max - min) + min);
    };

    drawSnake() {
        // Render each snake segment as a pixel
        this.snake.forEach((segment) => {
            this.userInterface.draw(segment, SNAKE_COLOR);
        });
    }

    drawPoint() {
        // Render the dot as a pixel
        this.userInterface.draw(this.point, POINT_COLOR);
    }

    moveSnake() {
        if (this.isChangingDirection) {
            return;
        }

        this.isChangingDirection = true;

        // Move the head forward by one pixel based on velocity
        const head = {
            x: this.snake[0].x + DIRECTIONS[this.currentDirection].x,
            y: this.snake[0].y + DIRECTIONS[this.currentDirection].y,
        };

        this.snake.unshift(head);

        // If the snake lands on a dot, increase the score and generate a new dot
        if (this.snake[0].x === this.point.x && this.snake[0].y === this.point.y) {
            this.score++;
            this.userInterface.updateScore(this.score);
            this.createPoint();
        } else {
            // Otherwise, slither
            this.snake.pop();
        }
    }

    changeDirection = (_: Event, key: { name: string }) => {
        if ((key.name === DIRECTION.UP || key.name === 'w') && this.currentDirection !== DIRECTION.DOWN) {
            this.currentDirection = DIRECTION.UP;
        }
        if ((key.name === DIRECTION.DOWN || key.name === 's') && this.currentDirection !== DIRECTION.UP) {
            this.currentDirection = DIRECTION.DOWN;
        }
        if ((key.name === DIRECTION.LEFT || key.name === 'a') && this.currentDirection !== DIRECTION.RIGHT) {
            this.currentDirection = DIRECTION.LEFT;
        }
        if ((key.name === DIRECTION.RIGHT || key.name === 'd') && this.currentDirection !== DIRECTION.LEFT) {
            this.currentDirection = DIRECTION.RIGHT;
        }
    };

    isGameOver() {
        // If the snake collides with itself, end the game
        const isColliding = this.snake
            // Filter out the head
            .filter((_, i) => i > 0)
            // If head collides with any segment, collision
            .some((segment) => segment.x === this.snake[0].x && segment.y === this.snake[0].y);

        return (
            isColliding ||
            // Right wall
            this.snake[0].x >= this.userInterface.gameContainer.width - 1 ||
            // Left wall
            this.snake[0].x <= -1 ||
            // Top wall
            this.snake[0].y >= this.userInterface.gameContainer.height - 1 ||
            // Bottom wall
            this.snake[0].y <= -1
        );
    }

    tick = () => {
        if (this.isGameOver()) {
            this.showGameOverScreen();
            clearInterval(this.timer as ReturnType<typeof setInterval>);
            this.timer = null;

            return;
        }

        this.isChangingDirection = false;
        this.userInterface.clearScreen();
        this.drawPoint();
        this.moveSnake();
        this.drawSnake();
        this.userInterface.render();
    };

    reset = () => {
        // Set up initial state
        this.snake = [];

        for (let i = INITIAL_SNAKE_SIZE; i >= 0; i--) {
            this.snake[INITIAL_SNAKE_SIZE - i] = { x: i, y: 0 };
        }

        this.point = { x: 0, y: 0 };
        this.score = 0;
        this.currentDirection = DIRECTION.RIGHT;
        this.isChangingDirection = false;
        this.timer = null;

        // Generate the first dot before the game begins
        this.createPoint();
        this.userInterface.resetScore();
        this.userInterface.render();
    };

    start = () => {
        if (!this.timer) {
            this.reset();

            this.timer = setInterval(this.tick, GAME_SPEED);
        }
    };

    showGameOverScreen() {
        this.userInterface.gameOverScreen();
        this.userInterface.render();
    }

    quit = () => {
        process.exit(0);
    };
}
