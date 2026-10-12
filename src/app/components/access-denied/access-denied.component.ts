import { Component } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { APP_ROUTES, ROLE_CONSTANTS } from "../../constants/constants";
import { RoleService } from "../../services/role.service";

@Component({
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./access-denied.component.html",
  styleUrl: "./access-denied.component.css",
})
export class AccessDeniedComponent {
  readonly routes = APP_ROUTES;

  constructor(
    readonly roleService: RoleService,
    private readonly router: Router,
  ) {}

  switchToAdmin(): void {
    this.roleService.setRole(ROLE_CONSTANTS.admin);
    void this.router.navigate([APP_ROUTES.characterListUrl]);
  }
}
