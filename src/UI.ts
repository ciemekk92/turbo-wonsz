import blessed from 'blessed';

import { Point } from './fixtures';

interface Screen {
    title: string;
    render: () => void;
    on: (event: string, cb: (_: Event, key: { name: string }) => void) => void;
    key: (keys: string[], cb: () => void) => void;
}

export class UI {
    blessed: any;
    screen: Screen;
    gameContainer: any;
    scoreContainer: any;
    gameBox: any;
    scoreBox: any;
    gameOverBox: any;

    constructor() {
        this.blessed = blessed;
        this.screen = blessed.screen();
        this.screen.title = 'TurboWonsz';

        this.gameBox = this.createGameBox();
        this.scoreBox = this.createScoreBox();
        this.gameOverBox = this.createGameOverBox();

        this.gameContainer = this.blessed.box(this.gameBox);
        this.scoreContainer = this.blessed.box(this.scoreBox);
    }

    bindHandlers = (
        keyPressHandler: (_: Event, key: { name: string }) => void,
        quitHandler: () => void,
        enterHandler: () => void
    ) => {
        // Event to handle keypress i/o
        this.screen.on('keypress', keyPressHandler);
        this.screen.key(['escape', 'q', 'C-c'], quitHandler);
        this.screen.key(['enter'], enterHandler);
    };

    createGameBox = () => {
        return {
            parent: this.screen,
            top: 1,
            left: 0,
            width: '100%',
            height: '100%-1',
            style: {
                fg: 'black',
                bg: 'gray',
            },
        };
    };

    createScoreBox = () => {
        return {
            parent: this.screen,
            top: 0,
            left: 'left',
            width: '100%',
            height: 1,
            tags: true,
            style: {
                fg: 'white',
                bg: 'blue',
            },
        };
    };

    createGameOverBox() {
        return {
            parent: this.screen,
            top: 'center',
            left: 'center',
            width: 20,
            height: 6,
            tags: true,
            valign: 'middle',
            content: `{center}Koniec gry!\n\nNaciśnij enter aby spróbować ponownie{/center}`,
            border: {
                type: 'line',
            },
            style: {
                fg: 'black',
                bg: 'magenta',
                border: {
                    fg: '#ffffff',
                },
            },
        };
    }

    draw = (coord: Point, color: string) => {
        this.blessed.box({
            parent: this.gameContainer,
            top: coord.y,
            left: coord.x,
            width: 1,
            height: 1,
            style: {
                fg: color,
                bg: color,
            },
        });
    };

    gameOverScreen = () => {
        this.gameContainer = this.blessed.box(this.gameOverBox);
    };

    clearScreen = () => {
        this.gameContainer.detach();
        this.gameContainer = this.blessed.box(this.gameBox);
    };

    updateScore = (score: number) => {
        this.scoreContainer.setLine(0, `{bold}Score:{/bold} ${score}`);
    };

    resetScore = () => {
        this.scoreContainer.detach();
        this.scoreContainer = this.blessed.box(this.scoreBox);
        this.updateScore(0);
    };

    render = () => {
        this.screen.render();
    };
}
