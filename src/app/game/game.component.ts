import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { MatDialog } from '@angular/material/dialog';
import { GameInfoComponent } from "../game-info/game-info.component";
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule,
    PlayerComponent,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    GameInfoComponent,
  ],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  games: Game[] = [];
  pickCardAnimation = false;
  game: Game;
  currentCard: string | undefined = '';
  name: string | undefined = '';
  animal: string | undefined = '';

  constructor(public dialog: MatDialog, private gameService: GameService) {
    this.game = new Game();
  }

  ngOnInit(): void {
    this.subscribeToGames();  
  }

  newGame(): void {
    const newGame = new Game();
    this.gameService.addNewGame(newGame).then(() => {
      console.log('New game saved to Firebase');
    }).catch((error) => {
      console.error('Error adding new game:', error);
    });
  }
  
  subscribeToGames(): void {
    this.gameService.getGamesSnapshot().subscribe((games: Game[]) => {
      this.games = games;
      console.log('Updated games:', this.games);
    });
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      this.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      setTimeout(() => {
        this.game.playedCard.push(this.currentCard!);
        this.pickCardAnimation = false;
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent, {
      data: { name: 'John Doe', animal: '' },
    });

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
      }
    });
  }
}
