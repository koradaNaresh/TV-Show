import { Component, computed, Signal, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import {
  APP_ROUTES,
  APP_SETTINGS,
  CHARACTER_STATUS,
  CHARACTER_VIEW_MODES,
  STATUS_CLASS_NAMES,
} from "../../constants/constants";
import { Character } from "../../models/rick-and-morty.models";
import { CharacterStoreService } from "../../services/character-store.service";

type ViewMode =
  (typeof CHARACTER_VIEW_MODES)[keyof typeof CHARACTER_VIEW_MODES];

@Component({
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./character-list.component.html",
  styleUrl: "./character-list.component.css",
})
export class CharacterListComponent {
  readonly viewModes = CHARACTER_VIEW_MODES;
  readonly routes = APP_ROUTES;
  readonly idDigits = APP_SETTINGS.cardIdDigits;
  readonly animationIndexModulo = APP_SETTINGS.rowAnimationIndexModulo;
  readonly filteredCharacters: Signal<Character[]>;
  readonly viewMode = signal<ViewMode>(CHARACTER_VIEW_MODES.grid);
  readonly skeletons = Array.from(
    { length: APP_SETTINGS.skeletonCardCount },
    (_unusedValue: undefined, index: number) => index + 1,
  );

  constructor(readonly store: CharacterStoreService) {
    this.filteredCharacters = computed(() => {
      const charactersForDisplay = [...this.store.characters()];

      charactersForDisplay.sort(
        (firstCharacter: Character, secondCharacter: Character) => {
          return firstCharacter.name.localeCompare(secondCharacter.name);
        },
      );

      return charactersForDisplay;
    });
  }

  statusIndicatorClass(status: string): string {
    const normalizedStatus = status.toLowerCase();

    if (normalizedStatus === CHARACTER_STATUS.alive) {
      return `${STATUS_CLASS_NAMES.indicator} ${STATUS_CLASS_NAMES.alive}`;
    }

    if (normalizedStatus === CHARACTER_STATUS.dead) {
      return `${STATUS_CLASS_NAMES.indicator} ${STATUS_CLASS_NAMES.dead}`;
    }

    return `${STATUS_CLASS_NAMES.indicator} ${STATUS_CLASS_NAMES.unknown}`;
  }

  /** Describes the count based on whether a search is currently active. */
  characterCountLabel(): string {
    if (this.store.searchTerm().length > 0) {
      return "matching characters";
    }

    return "known characters";
  }
}
