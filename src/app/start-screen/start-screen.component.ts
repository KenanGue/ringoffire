import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../services/game.service';
import { Game } from '../../models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss'],
})
export class StartScreenComponent {
  constructor(private gameService: GameService, private router: Router) {}

  async newGame(): Promise<void> {
    const newGame = new Game(); 
    try {
      const gameId = await this.gameService.addNewGame(newGame); 
      console.log('Neues Spiel erstellt mit ID:', gameId);

      this.router.navigate(['/game', gameId]);
    } catch (error) {
      console.error('Fehler beim Erstellen eines neuen Spiels:', error);
    }
  }
}
