import blessed, { Widgets } from 'blessed';
import {
  AVAILABLE_COLORS,
  DIRECTION,
  DIRECTIONS,
  INITIAL_SNAKE_SIZE,
  Point,
  SnakeSegmentCoord
} from './src/fixtures';
import { generateRandomCoord } from './src/helpers';

const screen = blessed.screen();

let snake: SnakeSegmentCoord[] = [];
let timer: ReturnType<typeof setInterval> | null = null;
let point: Point = { x: 0, y: 0 };
let score: number = 0;
let gameSpeed: number = 75;
let isHardMode: boolean = false;
let snakeColor: string = 'green';
let foodColor: string = 'red';

let isChangingDirection: boolean = false;
let currentDirection: DIRECTION = DIRECTION.RIGHT;

const gameBox = {
  parent: screen,
  top: 1,
  left: 0,
  width: '100%',
  height: '100%-1',
  style: {
    fg: 'red',
    bg: 'darkgray'
  }
};

const scoreBox = {
  parent: screen,
  top: 0,
  left: 'left',
  width: '100%',
  height: 1,
  tags: true,
  style: {
    fg: 'white',
    bg: 'blue'
  }
};

let gameContainer: Widgets.BoxElement = blessed.box(gameBox);

let scoreContainer: Widgets.BoxElement;

const updateScore = (score: number) => {
  screen.render();
  scoreContainer.setLine(0, `{bold}Wynik:{/bold} ${score}`);
};

const resetScore = () => {
  scoreContainer = blessed.box(scoreBox);
  scoreContainer.detach();
  scoreContainer = blessed.box(scoreBox);
  updateScore(0);
};

const clearScreen = () => {
  gameContainer.detach();
  gameContainer = blessed.box(gameBox);
};

const reset = () => {
  snake = [];

  for (let i = INITIAL_SNAKE_SIZE; i >= 0; i--) {
    snake[INITIAL_SNAKE_SIZE - i] = { x: i, y: 0 };
  }

  point = { x: 0, y: 0 };
  score = 0;
  currentDirection = DIRECTION.RIGHT;
  isChangingDirection = false;
  timer = null;

  createPoint();
  resetScore();
  render();
};

const isGameOver = () => {
  const isColliding = snake
    .filter((_: SnakeSegmentCoord, i: number) => i > 0)
    .some((segment) => segment.x === snake[0].x && segment.y === snake[0].y);

  return (
    isColliding ||
    // Right wall
    snake[0].x >= (gameContainer.width as number) - 1 ||
    // Left wall
    snake[0].x <= -1 ||
    // Top wall
    snake[0].y >= (gameContainer.height as number) - 1 ||
    // Bottom wall
    snake[0].y <= -1
  );
};

const gameOverScreen = () => {
  gameContainer = blessed.box({
    parent: screen,
    top: 'center',
    left: 'center',
    width: 30,
    height: 7,
    tags: true,
    valign: 'middle',
    content: `{center}Koniec gry!\n\nNaciśnij spację aby spróbować ponownie{/center}`,
    border: {
      type: 'line'
    },
    style: {
      fg: 'black',
      bg: 'magenta',
      border: {
        fg: '#ffffff'
      }
    }
  });
};

const showGameOverScreen = () => {
  gameOverScreen();
  render();
};

const draw = (coord: Point, color: string) => {
  blessed.box({
    parent: gameContainer,
    top: coord.y,
    left: coord.x,
    width: 1,
    height: 1,
    style: {
      fg: color,
      bg: color
    }
  });
};

const drawPoint = () => {
  draw(point, foodColor);
};

const drawSnake = () => {
  snake.forEach((segment: SnakeSegmentCoord) => {
    draw(segment, snakeColor);
  });
};

const moveSnake = () => {
  if (isChangingDirection) {
    return;
  }

  isChangingDirection = true;

  const head = {
    x: snake[0].x + DIRECTIONS[currentDirection].x,
    y: snake[0].y + DIRECTIONS[currentDirection].y
  };

  snake.unshift(head);

  if (snake[0].x === point.x && snake[0].y === point.y) {
    score++;
    updateScore(score);
    createPoint();
    if (isHardMode) {
      gameSpeed -= 5;
      clearInterval(timer as ReturnType<typeof setInterval>);
      timer = setInterval(tick, gameSpeed);
    }
  } else {
    snake.pop();
  }
};

const tick = () => {
  if (isGameOver()) {
    showGameOverScreen();
    clearInterval(timer as ReturnType<typeof setInterval>);
    timer = null;

    return;
  }

  isChangingDirection = false;
  clearScreen();
  drawPoint();
  moveSnake();
  drawSnake();
  render();
};

const start = () => {
  if (!timer) {
    reset();
    timer = setInterval(tick, gameSpeed);
  }
};

const handleChangeDirection = (_: Event, key: { name: string }) => {
  if ((key.name === DIRECTION.UP || key.name === 'w') && currentDirection !== DIRECTION.DOWN) {
    currentDirection = DIRECTION.UP;
  }
  if ((key.name === DIRECTION.DOWN || key.name === 's') && currentDirection !== DIRECTION.UP) {
    currentDirection = DIRECTION.DOWN;
  }
  if ((key.name === DIRECTION.LEFT || key.name === 'a') && currentDirection !== DIRECTION.RIGHT) {
    currentDirection = DIRECTION.LEFT;
  }
  if ((key.name === DIRECTION.RIGHT || key.name === 'd') && currentDirection !== DIRECTION.LEFT) {
    currentDirection = DIRECTION.RIGHT;
  }
};

const init = () => {
  snake = [];
  point = { x: 0, y: 0 };
  score = 0;
};

const createPoint = () => {
  point.x = generateRandomCoord(0, (gameContainer.width as number) - 1);
  point.y = generateRandomCoord(1, (gameContainer.height as number) - 1);

  snake.forEach((segment: SnakeSegmentCoord) => {
    if (segment.x === point.x && segment.y === point.y) {
      createPoint();
    }
  });
};

const render = () => {
  screen.render();
};

const handleGameStart = () => {
  gameContainer = blessed.box(gameBox);

  clearScreen();
  start();
};

const menuBox = {
  parent: screen,
  top: 'center',
  left: 'center',
  width: 50,
  height: 15,
  tags: true,
  valign: 'middle',
  border: {
    type: 'line'
  },
  style: {
    fg: 'black',
    bg: 'red',
    border: {
      fg: '#ffffff'
    }
  }
};

const mainMenuTitle = () => {
  return blessed.text({
    parent: screen,
    content: 'TurboWonsz',
    top: 3,
    left: 'center',
    align: 'center'
  });
};

const menuItems = {
  parent: screen,
  keys: true,
  mouse: true,
  autoCommandKeys: true,
  top: 7,
  left: 'center',
  width: 40,
  height: 1,
  items: {
    Start: {
      callback: () => handleGameStart()
    },
    Opcje: {
      callback: () => showOptionsScreen()
    },
    Wyjście: {
      callback: () => process.exit(0)
    }
  },
  style: {
    fg: 'red',
    bg: 'red',
    item: {
      hover: {
        fg: 'white',
        bg: 'black'
      }
    },
    selected: {
      fg: 'white',
      bg: 'black'
    },
    prefix: {
      fg: 'white'
    }
  }
};

const mainMenuWithItems = () => {
  // @ts-ignore
  return blessed.listbar(menuItems);
};

const mainMenuScreen = () => {
  // @ts-ignore
  gameContainer = blessed.box(menuBox);
  gameContainer.append(mainMenuTitle());
  gameContainer.append(mainMenuWithItems());
};

const showMainMenuContainer = () => {
  mainMenuScreen();
  render();
};

const showOptionsScreen = () => {
  const optionsForm = blessed.form({
    parent: screen,
    width: '80%',
    left: 'center',
    keys: true,
    vi: true,
    mouse: true
  });

  const label1 = blessed.text({
    parent: optionsForm,
    top: 3,
    left: 5,
    content: 'Tryb trudny'
  });

  const hardModeCheckbox = blessed.checkbox({
    parent: optionsForm,
    checked: isHardMode,
    mouse: true,
    name: 'hardMode',
    content: 'Zaznacz, aby aktywować',
    top: 3,
    left: 34
  });

  const label2 = blessed.text({
    parent: optionsForm,
    top: 6,
    left: 5,
    content: 'Kolor węża'
  });

  const radioSet1 = blessed.radioset({
    parent: optionsForm,
    width: '100%',
    top: 6,
    left: 19
  });

  const greenSnake = blessed.radiobutton({
    parent: radioSet1,
    name: 'snakeColor',
    checked: snakeColor === 'green',
    content: 'Zielony',
    left: 15,
    mouse: true
  });

  const yellowSnake = blessed.radiobutton({
    parent: radioSet1,
    name: 'snakeColor',
    hecked: snakeColor === 'yellow',
    content: 'Żółty',
    left: 30,
    mouse: true
  });

  const redSnake = blessed.radiobutton({
    parent: radioSet1,
    name: 'snakeColor',
    hecked: snakeColor === 'red',
    content: 'Czerwony',
    left: 45,
    mouse: true
  });

  const label3 = blessed.text({
    parent: optionsForm,
    top: 9,
    left: 5,
    content: 'Kolor jedzenia'
  });

  const radioSet2 = blessed.radioset({
    parent: optionsForm,
    width: '100%',
    top: 9,
    left: 19
  });

  const greenFood = blessed.radiobutton({
    parent: radioSet2,
    name: 'foodColor',
    checked: foodColor === 'green',
    content: 'Zielony',
    left: 15,
    mouse: true
  });

  const yellowFood = blessed.radiobutton({
    parent: radioSet2,
    checked: foodColor === 'yellow',
    name: 'foodColor',
    content: 'Żółty',
    left: 30,
    mouse: true
  });

  const redFood = blessed.radiobutton({
    parent: radioSet2,
    checked: foodColor === 'red',
    name: 'foodColor',
    content: 'Czerwony',
    left: 45,
    mouse: true
  });

  const saveButton = blessed.button({
    parent: optionsForm,
    name: 'submit',
    content: 'Zapisz',
    mouse: true,
    top: 25,
    left: 10,
    shrink: true,
    padding: {
      top: 1,
      right: 2,
      bottom: 1,
      left: 2
    },
    style: {
      bold: true,
      fg: 'white',
      bg: 'green',
      focus: {
        inverse: true
      }
    }
  });

  const cancelButton = blessed.button({
    parent: optionsForm,
    name: 'submit',
    content: 'Anuluj',
    mouse: true,
    top: 25,
    left: 20,
    shrink: true,
    padding: {
      top: 1,
      right: 2,
      bottom: 1,
      left: 2
    },
    style: {
      bold: true,
      fg: 'white',
      bg: 'red',
      focus: {
        inverse: true
      }
    }
  });
  // @ts-ignore
  gameContainer = blessed.box(gameBox);
  gameContainer.append(optionsForm);

  optionsForm.on(
    'submit',
    (data: { hardMode: boolean; snakeColor: boolean[] | boolean; foodColor: boolean[] | boolean }) => {
      const snakeColorIndex = Array.isArray(data.snakeColor) ? (data.snakeColor.length === 2 ? 1 : 0) : 2;
      const foodColorIndex = Array.isArray(data.foodColor) ? (data.foodColor.length === 2 ? 1 : 0) : 2;

      snakeColor = AVAILABLE_COLORS[snakeColorIndex];
      foodColor = AVAILABLE_COLORS[foodColorIndex];

      if (data.hardMode) {
        isHardMode = true;
      } else {
        isHardMode = false;
      }
      4;
    }
  );

  saveButton.on('press', () => {
    optionsForm.submit();
    optionsForm.detach();
    showMainMenuContainer();
  });

  cancelButton.on('press', () => {
    optionsForm.detach();
    showMainMenuContainer();
  });
  render();
};

screen.title = 'TurboWonsz';
screen.on('keypress', handleChangeDirection);
screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
screen.key(['space'], start);

showMainMenuContainer();
