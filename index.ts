import { Game } from './src/Game';
import { UI } from './src/UI';

const game = new Game(new UI());

game.start();
