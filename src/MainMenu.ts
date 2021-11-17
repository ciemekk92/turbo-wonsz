import blessed from 'blessed';
import { Game } from './Game';
import { UI } from './UI';

export class MainMenu {
    userInterface: UI;
    game: Game;

    constructor(userInterface: UI, game: Game) {
        this.userInterface = userInterface;
        this.game = game;
    }

    showMainMenuContainer = () => {
        this.userInterface.mainMenuScreen();
        this.userInterface.render();
    };
}
