import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'weather',
    pathMatch: 'prefix'
  }, 
  {
    path: 'weather',
    loadChildren: () => import('./index/index.module').then((m) => m.IndexModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
