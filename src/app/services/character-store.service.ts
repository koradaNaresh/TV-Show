import { Injectable, signal } from '@angular/core';
import { Subject, catchError, debounceTime, of, switchMap } from 'rxjs';
import { APP_SETTINGS } from '../constants/constants';
import { Character } from '../models/rick-and-morty.models';
import { RickAndMortyApiService } from './rick-and-morty-api.service';

@Injectable({ providedIn: 'root' })
export class CharacterStoreService {
  // Signals make the latest search results available to every routed page.
  readonly characters = signal<Character[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly searchTerm = signal('');
  private readonly searches = new Subject<string>();

  constructor(private readonly api: RickAndMortyApiService) {
    this.searches.pipe(
      // Wait briefly so we do not send one API request for every keystroke.
      debounceTime(APP_SETTINGS.searchDebounceMilliseconds),
      switchMap((term) => {
        this.loading.set(true);
        this.error.set('');

        return this.api.getAllCharacters(term).pipe(
          catchError(() => {
            this.error.set('We could not reach the portal network. Check your connection and try again.');
            return of([]);
          }),
        );
      }),
    ).subscribe((characters: Character[]) => {
      this.characters.set(characters);
      this.loading.set(false);
    });
  }

  /** Stores the text shown in the search field and starts a new API search. */
  search(term: string): void {
    const normalized = term.trim();
    this.searchTerm.set(term);
    this.searches.next(normalized);
  }

  /** Repeats the current search after a request failure. */
  retry(): void {
    this.searches.next(this.searchTerm().trim());
  }
}
