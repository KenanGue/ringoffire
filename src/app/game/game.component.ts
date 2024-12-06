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
import { ActivatedRoute } from '@angular/router';
import { Params } from '@angular/router';

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

  constructor(public dialog: MatDialog, private gameService: GameService, private route: ActivatedRoute) {
    this.game = new Game();
  }

  ngOnInit(): void {
    this.subscribeToGames();  
    this.loadGameFromRoute();
    this.route.params.subscribe((params) => {
    const gameId = params['id']; 
    if (gameId) {
      this.loadGameById(gameId);
    }
  });
  }

  loadGameFromRoute(): void {
    this.route.params.subscribe((params: Params) => {
      const gameId = params['id']; 
      if (gameId) {
        this.loadGameById(gameId);
      }
    });
  }

  async loadGameById(gameId: string): Promise<void> {
    try {
      const fetchedGame = await this.gameService.getGameById(gameId);
      if (fetchedGame) {
        this.game = fetchedGame;
        console.log('Spiel erfolgreich geladen:', this.game);
      } else {
        console.warn('Kein Spiel mit dieser ID gefunden.');
      }
    } catch (error) {
      console.error('Fehler beim Laden des Spiels:', error);
    }
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
      const card = this.game.stack.pop(); 
      if (card) {
        this.currentCard = card;
        this.pickCardAnimation = true;
  
        this.game.currentPlayer++;
        this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
  
        setTimeout(() => {
          this.game.playedCard.push(this.currentCard!);
          this.pickCardAnimation = false;
  
          this.updateGameInFirebase();
        }, 1000);
      }
    }
  }
  
  updateGameInFirebase(): void {
    if (this.game.id) {
      this.gameService.updateGame(this.game.id, this.game)
        .then(() => {
          console.log('Spiel in Firebase aktualisiert.');
        })
        .catch(error => {
          console.error('Fehler beim Aktualisieren des Spiels:', error);
        });
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
