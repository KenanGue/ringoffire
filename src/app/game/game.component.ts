import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { Subscription } from 'rxjs';

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
export class GameComponent implements OnInit, OnDestroy{
  private gameSubscription: Subscription | null = null;
  games: Game[] = [];
  pickCardAnimation = false;
  currentCard: string | undefined = '';
  game: Game;
  name: string | undefined = '';
  animal: string | undefined = '';

  constructor(public dialog: MatDialog, private gameService: GameService, private route: ActivatedRoute) {
    this.game = new Game();
  }

  ngOnInit(): void {
    this.subscribeToGames();
    this.route.params.subscribe((params) => {
      const gameId = params['id'];
      if (gameId) {
        this.loadGameById(gameId);
      }
    });
    this.route.params.subscribe((params) => {
      const gameId = params['id'];
      if (gameId) {
        this.subscribeToGameUpdates(gameId);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe();
    }
  }

  subscribeToGameUpdates(gameId: string): void {
    this.gameSubscription = this.gameService.getGameSnapshot(gameId).subscribe((updatedGame) => {
      this.game = updatedGame;

      // Synchronisiere die aktuelle Karte, falls vorhanden
      if (this.game && this.game.playedCard.length > 0) {
        this.currentCard = this.game.playedCard[this.game.playedCard.length - 1];
      } else {
        this.currentCard = '';
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
        console.warn('Kein Spiel gefunden.');
      }
    } catch (error) {
      console.error('Fehler beim Laden des Spiels:', error);
    }
  }

  subscribeToGames(): void {
    this.gameService.getGamesSnapshot().subscribe((games: Game[]) => {
      this.games = games;
      console.log('Updated games:', this.games);
    });
  }

  takeCard(): void {
    if (!this.pickCardAnimation && this.game && this.game.stack.length > 0) {
      const card = this.game.stack.pop();
      if (card) {
        this.currentCard = card;
        this.pickCardAnimation = true;

        this.game.currentPlayer++;
        this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
        setTimeout(() => {
          if (this.game) {
          this.game.playedCard.push(this.currentCard!);
          this.pickCardAnimation = false;

          this.updateGameInFirebase();
          }
        }, 1000);
      }
    }
  }

  async updateGameInFirebase(): Promise<void> {
    if (this.game?.id) {
      try {
        await this.gameService.updateGame(this.game.id, this.game);
      } catch (error) {
        console.error('Fehler beim Aktualisieren des Spiels:', error);
      }
    }
  }
  

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent, {
      data: { name: 'John Doe', animal: '' },
    });
  
    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.updateGameInFirebase(); 
      }
    });
  }
  
  
}
