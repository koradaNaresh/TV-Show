import { Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { APP_ROUTES, ROLE_CONSTANTS } from "../constants/index";
import { RoleService } from "../services/role.service";

/**
 * Restricts the episode-detail route to the simulated Admin role.
 * This is a front-end demonstration and is not a replacement for server security.
 */
@Injectable({ providedIn: "root" })
export class AdminGuard implements CanActivate {
  constructor(
    private readonly roleService: RoleService,
    private readonly router: Router,
  ) {}

  canActivate(): boolean | UrlTree {
    if (this.roleService.role() === ROLE_CONSTANTS.admin) {
      return true;
    }

    return this.router.createUrlTree([APP_ROUTES.accessDeniedUrl]);
  }
}
