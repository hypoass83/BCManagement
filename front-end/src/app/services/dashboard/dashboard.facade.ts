import { Injectable } from "@angular/core";
import { DashboardService } from "src/app/generated";

@Injectable({ providedIn: 'root' })
export class DashboardFacade {

  constructor(private api: DashboardService) {}

  loadStats(session: number) {
    return this.api.dashboardControllerGetImportStats(session);
  }
}
