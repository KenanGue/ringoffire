import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), provideAnimationsAsync(), provideFirebaseApp(() => initializeApp({"projectId":"ring-of-fire-f32c6","appId":"1:1043589569814:web:c8e0889d3fc406153ac437","storageBucket":"ring-of-fire-f32c6.firebasestorage.app","apiKey":"AIzaSyDLFkbfKVGY0tnCsXoY_biItQ9GKtx6Oyk","authDomain":"ring-of-fire-f32c6.firebaseapp.com","messagingSenderId":"1043589569814"})), provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({"projectId":"ring-of-fire-f32c6","appId":"1:1043589569814:web:c8e0889d3fc406153ac437","storageBucket":"ring-of-fire-f32c6.firebasestorage.app","apiKey":"AIzaSyDLFkbfKVGY0tnCsXoY_biItQ9GKtx6Oyk","authDomain":"ring-of-fire-f32c6.firebaseapp.com","messagingSenderId":"1043589569814"})), provideFirestore(() => getFirestore())]
};
