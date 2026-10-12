import { Injectable, signal } from "@angular/core";
import { ROLE_CONSTANTS } from "../constants/constants";

export type UserRole =
  | typeof ROLE_CONSTANTS.admin
  | typeof ROLE_CONSTANTS.viewer;

@Injectable({ providedIn: "root" })
export class RoleService {
  readonly role = signal<UserRole>(ROLE_CONSTANTS.admin);

  constructor() {
    // Restore the demo selection so refreshing the page does not change roles.
    if (typeof localStorage !== "undefined") {
      const savedRole = localStorage.getItem(ROLE_CONSTANTS.storageKey);

      if (
        savedRole === ROLE_CONSTANTS.admin ||
        savedRole === ROLE_CONSTANTS.viewer
      ) {
        this.role.set(savedRole);
      }
    }
  }

  setRole(role: UserRole): void {
    this.role.set(role);

    // The storage check also allows this service to be used during server rendering.
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(ROLE_CONSTANTS.storageKey, role);
    }
  }
}
