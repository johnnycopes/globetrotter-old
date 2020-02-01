import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { RouteNames } from './shared/model/route-names.enum';
import { CountryService } from './core/services/country/country.service';
import { AuthGuard } from './core/guards/auth/auth.guard';
import { ShellComponent } from './core/components/shell/shell.component';
import { HomeComponent } from './features/home/home.component';
import { PlaceholderComponent } from './shared/components/placeholder/placeholder.component';
import { LearnComponent } from './features/learn/learn.component';
import { AccountComponent } from './features/account/account.component';
import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '', component: ShellComponent, resolve: { countries: CountryService }, children: [
    { path: RouteNames.home, component: HomeComponent },
    { path: RouteNames.explore, component: PlaceholderComponent },
    { path: RouteNames.prepare, component: PlaceholderComponent },
    { path: RouteNames.learn,
      component: LearnComponent,
      loadChildren: () => import('./features/learn/learn.module').then(m => m.LearnModule)
    },
    { path: RouteNames.account,
      component: AccountComponent,
      canActivateChild: [AuthGuard],
      loadChildren: () => import('./features/account/account.module').then(m => m.AccountModule)
    },
    { path: '', redirectTo: RouteNames.home, pathMatch: 'full' }
  ]},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
