import { Component, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { ImportDashboardStats } from 'src/app/models/import-dashboard-stats.model';
import { DashboardFacade } from 'src/app/services/dashboard/dashboard.facade';


// Column Definition Type Interface


@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  stats?: ImportDashboardStats;
  selectedSession = 0;
  sessions: number[] = [];

  constructor(
    private translocoService: TranslocoService,
    private facade: DashboardFacade
  ) {


  }


ngOnInit(): void {
    this.loadDashboard(0); // session la plus récente
  }

loadDashboard(session: number) {
    this.facade.loadStats(session).subscribe(res => {
      this.stats = res;
      this.selectedSession = res.session;
      this.populateSessions(res.session);
    });
  }

  
  onSessionChange(session: number) {
    this.loadDashboard(session);
  }

  private populateSessions(latest: number) {
    this.sessions = [];
    for (let y = latest; y >= latest - 5; y--) {
      this.sessions.push(y);
    }
  }

  t(key: string, params?: object): string {
    return this.translocoService.translate(key, params);
  }


}
