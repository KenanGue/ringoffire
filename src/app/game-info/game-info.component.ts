import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-game-info',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './game-info.component.html',
  styleUrl: './game-info.component.scss'
})
export class GameInfoComponent {
  cardAction = [
    { title: 'Waterfall', description: 'Everyone has to start drinking at the same time. As soon as player 1 stops drinking, player 2 may stop drinking. Player 3 may stop as soon as player 2 stops drinking, and so on.' },
    { title: 'You', description: 'You decide who drinks' },
    { title: 'Me', description: 'Congrats! Drink a shot!' },
    { title: 'Category', description: 'Come up with a category (e.g. Colors). Each player must enumerate one item from the category.' },
    { title: 'Bust a jive', description: 'Player 1 makes a dance move. Player 2 repeats the dance move and adds a second one. ' },
    { title: 'Chicks', description: 'All girls drink.' },
    { title: 'Heaven', description: 'Put your hands up! The last player drinks!' },
    { title: 'Mate', description: 'Pick a mate. Your mate must always drink when you drink and the other way around.' },
    { title: 'Thumbmaster', description: 'The Thumbmaster can place their thumb on the table at any time, and the last player to notice and do the same must drink.' },
    { title: 'Men', description: 'All men drink.' },
    { title: 'Quizmaster', description: 'The Quizmaster can ask any player a question at any time, and if the player answers, they must drink.' },
    { title: 'Never have i ever...', description: 'Say something you nnever did. Everyone who did it has to drink.' },
    { title: 'Rule', description: 'Make a rule. Everyone needs to drink when he breaks the rule.' },
  ];
  
  @Input() set card(value: string | undefined) {
    this.updateCardInfo(value);
  }
  
  title: string = 'Default Title';
  description: string = 'Default Description';

  constructor() { }

  ngOnInit(): void {
  }

  private updateCardInfo(card: string | undefined): void {
  if (card) {
    const cardParts = card.split('_');
    const cardNumber = cardParts.length > 1 ? +cardParts[1] : NaN;
    if (!isNaN(cardNumber) && cardNumber > 0 && cardNumber <= this.cardAction.length) {
      this.title = this.cardAction[cardNumber - 1]?.title || '';
      this.description = this.cardAction[cardNumber - 1]?.description || '';
    } else {
      this.title = 'Invalid Card';
      this.description = 'The card number is not valid.';
    }
  } else {
    this.title = 'Start the game';
    this.description = 'Click on Card-Stack';
  }
}


}
