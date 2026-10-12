import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { API_CONSTANTS, APP_ROUTES, ROLE_CONSTANTS } from './constants/constants';
import { CharacterStoreService } from './services/character-store.service';
import { RoleService, UserRole } from './services/role.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterOutlet],
  template: `
    <!-- Shared header, routed page content, and attribution footer. -->
    <div class="app-shell">
      <header class="topbar">
        <a
          class="brand"
          [routerLink]="routes.characterListUrl"
          aria-label="Rick and Morty Character Explorer home"
        >
          <span class="brand-mark" aria-hidden="true">
            <span></span>
            <span></span>
          </span>
          <span class="brand-name">
            RICK<span class="brand-amp"> &amp; </span>MORTY
          </span>
          <span class="brand-divider"></span>
          <span class="brand-product">
            CHARACTER<br>
            EXPLORER
          </span>
        </a>

        <label class="global-search" [class.search-active]="searchFocused">
          <img class="search-icon" src="/assets/icons/search.svg" alt="">
          <input
            type="search"
            placeholder="Search characters by name..."
            aria-label="Search characters by name"
            [(ngModel)]="searchValue"
            (ngModelChange)="onSearch($event)"
            (focus)="searchFocused = true"
            (blur)="searchFocused = false"
          >
          <kbd>&#x2318; K</kbd>
        </label>

        <div class="topbar-actions">
          <span class="role-label">
            <span class="role-dot"></span>
            DEMO ROLE
          </span>
          <select
            class="role-select"
            [value]="roleService.role()"
            (change)="changeRole($event)"
            aria-label="Switch demo role"
          >
            <option [value]="roles.admin">Admin</option>
            <option [value]="roles.viewer">Viewer</option>
          </select>
        </div>
      </header>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <footer class="site-footer">
        <span>DIMENSION C-137 &#x00B7; INTERDIMENSIONAL CHARACTER DATABASE</span>
        <span>
          DATA VIA
          <a [href]="api.websiteUrl" target="_blank" rel="noreferrer">
            RICKANDMORTYAPI.COM
          </a>
        </span>
      </footer>
    </div>
  `,
})
export class AppComponent implements OnInit {
  readonly routes = APP_ROUTES;
  readonly roles = ROLE_CONSTANTS;
  readonly api = API_CONSTANTS;

  // Shared services are injected through the constructor for clarity.
  constructor(
    readonly roleService: RoleService,
    private readonly store: CharacterStoreService,
    private readonly router: Router,
  ) {}

  searchValue = '';
  searchFocused = false;

  ngOnInit(): void {
    // Load the full catalog the first time the application opens.
    this.store.search('');

    // Keep the search field in sync when navigation returns to the catalog.
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => {
          return event instanceof NavigationEnd;
        }),
      )
      .subscribe((navigationEvent: NavigationEnd) => {
        const isCatalogRoute =
          navigationEvent.urlAfterRedirects === APP_ROUTES.characterListUrl;
        const searchTextHasChanged = this.searchValue !== this.store.searchTerm();

        if (isCatalogRoute && searchTextHasChanged) {
          this.searchValue = this.store.searchTerm();
        }
      });
  }

  /** Updates the shared search results and returns users to the catalog. */
  onSearch(value: string): void {
    this.store.search(value);

    const isOnAnyCharacterRoute = this.router.url.startsWith(
      APP_ROUTES.characterListUrl,
    );
    const isOnCharacterDetails = this.router.url.startsWith(
      `${APP_ROUTES.characterListUrl}/`,
    );

    if (!isOnAnyCharacterRoute || isOnCharacterDetails) {
      void this.router.navigate([APP_ROUTES.characterListUrl]);
    }
  }

  /** Applies the selected demo role and redirects viewers away from details. */
  changeRole(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    if (
      selectedValue !== ROLE_CONSTANTS.admin &&
      selectedValue !== ROLE_CONSTANTS.viewer
    ) {
      return;
    }

    const selectedRole: UserRole = selectedValue;
    this.roleService.setRole(selectedRole);

    const isViewerOnCharacterDetails =
      selectedRole === ROLE_CONSTANTS.viewer &&
      this.router.url.startsWith(`${APP_ROUTES.characterListUrl}/`);

    if (isViewerOnCharacterDetails) {
      void this.router.navigate([APP_ROUTES.accessDeniedUrl]);
    }
  }
}
