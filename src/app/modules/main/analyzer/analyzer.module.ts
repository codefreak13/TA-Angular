import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatSliderModule } from "@angular/material/slider";
import { CommonModule } from "@angular/common";
import { MatTableModule } from "@angular/material/table";
import { FormsModule } from "@angular/forms";
import { MatTooltipModule } from "@angular/material/tooltip";

import { CoreModule } from "src/app/core/core.module";

import AnalyzerComponent from "./analyzer.component";
import { ROUTES } from "./analyzer.routes";
import { FlexLayoutModule } from "@angular/flex-layout";

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
    FormsModule,
    MatTooltipModule,
    FlexLayoutModule,
  ],
})
export class AnalyzerModule {}
