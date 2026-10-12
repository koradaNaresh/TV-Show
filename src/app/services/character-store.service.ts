import { Injectable, signal } from "@angular/core";
import { Subject, catchError, debounceTime, of, switchMap } from "rxjs";
import { APP_SETTINGS } from "../constants/constants";
import { Character } from "../models/rick-and-morty.models";
import { RickAndMortyApiService } from "./rick-and-morty-api.service";

@Injectable({ providedIn: "root" })
export class CharacterStoreService {
  readonly characters = signal<Character[]>([]);
  readonly loading = signal(false);
  readonly error = signal("");
  readonly searchTerm = signal("");
  private readonly searches = new Subject<string>();

  constructor(private readonly api: RickAndMortyApiService) {
    this.searches
      .pipe(
        debounceTime(APP_SETTINGS.searchDebounceMilliseconds),
        switchMap((term) => {
          this.loading.set(true);
          this.error.set("");

          return this.api.getAllCharacters(term).pipe(
            catchError(() => {
              this.error.set(
                "We could not reach the portal network. Check your connection and try again.",
              );
              return of([]);
            }),
          );
        }),
      )
      .subscribe((characters: Character[]) => {
        this.characters.set(characters);
        this.loading.set(false);
      });
  }

  search(term: string): void {
    const normalized = term.trim();
    this.searchTerm.set(term);
    this.searches.next(normalized);
  }

  retry(): void {
    this.searches.next(this.searchTerm().trim());
  }
}
