import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexRoutingModule } from './index-routing.module';
import { IndexComponent } from './index.component';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [IndexComponent],
  imports: [CommonModule, IndexRoutingModule, MatTableModule],
})
export class IndexModule {}
