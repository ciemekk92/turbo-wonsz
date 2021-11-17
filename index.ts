import { Game } from './src/Game';
import { MainMenu } from './src/MainMenu';
import { UI } from './src/UI';

const userInterface = new UI();
const game = new Game(userInterface);
const mainMenu = new MainMenu(userInterface, game);

mainMenu.showMainMenuContainer();

