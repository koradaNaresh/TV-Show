import {
  Component,
  OnDestroy,
  OnInit,
  Signal,
  computed,
  signal,
} from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { Subscription, catchError, of, switchMap } from "rxjs";
import {
  APP_ROUTES,
  APP_SETTINGS,
  CHARACTER_STATUS,
  STATUS_CLASS_NAMES,
} from "../../constants/constants";
import { Character, Episode } from "../../models/rick-and-morty.models";
import { RickAndMortyApiService } from "../../services/rick-and-morty-api.service";

@Component({
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./character-detail.component.html",
  styleUrl: "./character-detail.component.css",
})
export class CharacterDetailComponent implements OnInit, OnDestroy {
  readonly routes = APP_ROUTES;
  readonly idDigits = APP_SETTINGS.cardIdDigits;
  private subscription?: Subscription;
  readonly character = signal<Character | null>(null);
  readonly episodes = signal<Episode[]>([]);
  readonly loading = signal(true);
  readonly episodeLoading = signal(false);
  readonly error = signal("");
  readonly episodeQuery = signal("");
  readonly filteredEpisodes: Signal<Episode[]>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly api: RickAndMortyApiService,
  ) {
    this.filteredEpisodes = computed(() => {
      const searchText = this.episodeQuery().trim().toLocaleLowerCase();

      return this.episodes().filter((episode: Episode) => {
        return episode.name.toLocaleLowerCase().includes(searchText);
      });
    });
  }

  ngOnInit(): void {
    this.subscription = this.route.paramMap
      .pipe(
        switchMap((routeParameters) => {
          const characterId = Number(
            routeParameters.get(APP_ROUTES.characterIdParameter),
          );
          this.beginLoadingCharacter();

          return this.api.getCharacter(characterId).pipe(
            switchMap((loadedCharacter) => {
              this.character.set(loadedCharacter);
              return this.api.getEpisodesForCharacter(loadedCharacter);
            }),
            catchError(() => {
              this.error.set(
                "The character or its episode records could not be found. Please return to the catalog and try again.",
              );
              return of([] as Episode[]);
            }),
          );
        }),
      )
      .subscribe((loadedEpisodes: Episode[]) => {
        this.episodes.set(loadedEpisodes);
        this.loading.set(false);
        this.episodeLoading.set(false);
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private beginLoadingCharacter(): void {
    this.loading.set(true);
    this.episodeLoading.set(true);
    this.error.set("");
    this.character.set(null);
    this.episodes.set([]);
    this.episodeQuery.set("");
  }

  statusClass(status: string): string {
    const normalizedStatus = status.toLowerCase();

    if (normalizedStatus === CHARACTER_STATUS.alive) {
      return STATUS_CLASS_NAMES.alive;
    }

    if (normalizedStatus === CHARACTER_STATUS.dead) {
      return STATUS_CLASS_NAMES.dead;
    }

    return STATUS_CLASS_NAMES.unknown;
  }

  statusPillClass(status: string): string {
    return `${STATUS_CLASS_NAMES.detailPill} ${this.statusClass(status)}`;
  }

  updateEpisodeQuery(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.episodeQuery.set(inputElement.value);
  }

  emptyEpisodeMessage(): string {
    if (this.episodeQuery().length > 0) {
      return "No episodes match that search.";
    }

    return "No episode records available.";
  }
}
