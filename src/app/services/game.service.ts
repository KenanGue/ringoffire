import { Injectable, inject } from '@angular/core';
import { doc, getDoc, updateDoc, docData  } from '@angular/fire/firestore';
import { Firestore, collection, collectionData, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Game } from '../../models/game';


@Injectable({
  providedIn: 'root'
})
export class GameService {
  firestore: Firestore = inject(Firestore);

  constructor() {}

  getGamesSnapshot(): Observable<Game[]> {
    const gamesCollection = collection(this.firestore, 'Games');
    return collectionData(gamesCollection, { idField: 'id' }) as Observable<Game[]>;
  }
  
  getGameSnapshot(gameId: string): Observable<Game> {
    const gameDocRef = doc(this.firestore, `Games/${gameId}`);
    return docData(gameDocRef, { idField: 'id' }) as Observable<Game>;
  }
  

  async addNewGame(game: Game): Promise<string> {
  const gamesCollection = collection(this.firestore, 'Games');
  const docRef = await addDoc(gamesCollection, { ...game });
  console.log('Stack vor dem Speichern:', game.stack);
  return docRef.id; // Rückgabe der neuen Spiel-ID
}


async getGameById(gameId: string): Promise<Game | undefined> {
  const gameDocRef = doc(this.firestore, `Games/${gameId}`);
  const gameSnapshot = await getDoc(gameDocRef);

  if (gameSnapshot.exists()) {
    const gameData = gameSnapshot.data() as Game;
    return { id: gameSnapshot.id, ...gameData };
  } else {
    console.error('Kein Spiel mit der angegebenen ID gefunden.');
    return undefined;
  }
}
async updateGame(gameId: string, updatedGame: Game): Promise<void> {
  const gameDocRef = doc(this.firestore, `Games/${gameId}`);
  await updateDoc(gameDocRef, { ...updatedGame });
  console.log('Firebase-Update gesendet:', updatedGame);
}


}

