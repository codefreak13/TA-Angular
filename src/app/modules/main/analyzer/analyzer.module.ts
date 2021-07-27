import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatSliderModule } from "@angular/material/slider";
import { CommonModule } from "@angular/common";
import { MatTableModule } from "@angular/material/table";

import { CoreModule } from "src/app/core/core.module";

import AnalyzerComponent from "./analyzer.component";
import { ROUTES } from "./analyzer.routes";

@NgModule({
  declarations: [AnalyzerComponent],
  imports: [
    CoreModule,
    RouterModule.forChild(ROUTES),
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
    MatSliderModule,
    CommonModule,
    MatTableModule,
  ],
})
export class AnalyzerModule {}
