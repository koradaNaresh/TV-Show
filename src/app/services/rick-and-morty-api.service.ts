import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, expand, map, reduce } from 'rxjs/operators';
import { API_CONSTANTS } from '../constants/index';
import { ApiResponse, Character, Episode } from '../models/rick-and-morty.models';

@Injectable({ providedIn: 'root' })
export class RickAndMortyApiService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Loads every character page returned by the API.
   * The API returns at most 20 characters per page and provides the next URL
   * in the response metadata when more pages are available.
   */
  getAllCharacters(name: string = ''): Observable<Character[]> {
    let requestParameters = new HttpParams();

    if (name.length > 0) {
      requestParameters = requestParameters
        .set(API_CONSTANTS.characterNameParameter, name)
        .set(API_CONSTANTS.pageParameter, API_CONSTANTS.firstPage);
    }

    return this.http
      .get<ApiResponse<Character>>(
        `${API_CONSTANTS.baseUrl}${API_CONSTANTS.characterEndpoint}`,
        {
          params: requestParameters,
        },
      )
      .pipe(
        expand((response) => {
          if (response.info.next === null) {
            return EMPTY;
          }

          return this.http.get<ApiResponse<Character>>(response.info.next);
        }),
        map((response) => response.results),
        reduce(
          (allCharacters, charactersOnPage) => {
            return allCharacters.concat(charactersOnPage);
          },
          [] as Character[],
        ),
        catchError((error: HttpErrorResponse) => {
          // The API responds with 404 when a name search has no matches.
          if (error.status === 404) {
            return of([]);
          }

          // Let the store display a useful message for other network errors.
          return throwError(() => error);
        }),
      );
  }

  /** Loads one character record using its numeric API identifier. */
  getCharacter(characterId: number): Observable<Character> {
    return this.http.get<Character>(
      `${API_CONSTANTS.baseUrl}${API_CONSTANTS.characterEndpoint}/${characterId}`,
    );
  }

  /**
   * Loads all episodes referenced by a character record, then sorts them
   * by API identifier so they appear in broadcast order.
   */
  getEpisodesForCharacter(character: Character): Observable<Episode[]> {
    const episodeIds: number[] = character.episode
      .map((episodeUrl: string) => {
        const finalUrlPart = episodeUrl.split('/').pop();
        return Number(finalUrlPart);
      })
      .filter((episodeId: number) => {
        return Number.isInteger(episodeId) && episodeId > 0;
      });

    if (episodeIds.length === 0) {
      return of([]);
    }

    const episodeRequests: Observable<Episode>[] = episodeIds.map(
      (episodeId: number) => {
        return this.http.get<Episode>(
          `${API_CONSTANTS.baseUrl}${API_CONSTANTS.episodeEndpoint}/${episodeId}`,
        );
      },
    );

    return forkJoin(episodeRequests).pipe(
      map((episodes: Episode[]) => {
        return episodes.sort((firstEpisode: Episode, secondEpisode: Episode) => {
          return firstEpisode.id - secondEpisode.id;
        });
      }),
    );
  }
}
