import { UnlocksComponent } from './components/unlocks/unlocks.component';
import { SwagStatsComponent } from './components/swag-stats/swag-stats.component';
import { UpgradesComponent } from './components/upgrades/upgrades.component';
import { InvestorsComponent } from './components/investors/investors.component';
import { ManagerComponent } from './components/manager/manager.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'swag-stats', component: SwagStatsComponent },
    { path: 'unlocks', component: UnlocksComponent },
    { path: 'upgrades', component: UpgradesComponent },
    { path: 'managers', component: ManagerComponent },
    { path: 'investors', component: InvestorsComponent },
    { path: '', redirectTo: 'swag-stats', pathMatch: 'full' },
  ];
  