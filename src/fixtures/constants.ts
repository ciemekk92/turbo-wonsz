export const DIRECTIONS = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    right: { x: 1, y: 0 },
    left: { x: -1, y: 0 },
};

export enum DIRECTION {
    UP = 'up',
    DOWN = 'down',
    LEFT = 'left',
    RIGHT = 'right',
}

export const GAME_SPEED = 50;
export const INITIAL_SNAKE_SIZE = 12;
export const SNAKE_COLOR = '#0000ff';
export const POINT_COLOR = 'red';
