import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";

import AgentFacade from "src/app/core/facades/agent.facade";
import CallFacade from "src/app/core/facades/call.facade";

import TemplateService from "src/app/core/services/template.service";
import Script from "src/app/core/models/script.model";

@Component({
  selector: "app-analyzer",
  templateUrl: "./analyzer.component.html",
  styleUrls: ["./analyzer.component.scss"],
  changeDetection: ChangeDetectionStrategy.Default,
})
export default class AnalyzerComponent implements OnInit, AfterViewInit {
  @ViewChild("subHeader")
  private subHeader?: TemplateRef<any>;
  public dataSourceRep: any[] = [];
  public resetCall = "";
  public defaultSliderValue = "38";
  public realDisplayedColumns: string[] = ["timeFrom", "channel", "sentence"];
  public expectedDisplayedColumns: string[] = [];
  public expectedCompositeDisplayedColumns =
    this.expectedDisplayedColumns.concat(["order", "rep", "sentence"]);
  public highlightMatchingScript: boolean = false;
  public matchedSentenceLine: number | undefined;

  constructor(
    public agents: AgentFacade,
    public calls: CallFacade,
    private _tplService: TemplateService
  ) {}

  public ngAfterViewInit(): void {
    this._tplService.register("subHeader", this.subHeader);
  }

  public ngOnInit(): void {}

  public selectAgent(event: any): void {
    this.defaultSliderValue = "38";
    this.resetCall = "";
    this.calls.isLoading$.next(true);
    this.agents.setActiveAgent(event?.value);
  }

  public selectCall(event: any): void {
    this.calls.selectCall(event?.value);
    this.calls.setMatchingPercentage(38);
  }

  public formatTime(s: number): string | number {
    return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
  }

  public matchSelectedScriptLine(element: Script) {
    this.highlightMatchingScript = true;
    const script = this.calls.activeScript$.value;
    const value = script?.find((i) => i.sentence === element.matchingSentence);
    this.matchedSentenceLine = value?.order;
  }

  public highlightMatchedTranscriptLines(order: number): string {
    const transcript = this.calls.transcriptOrderIds$.value;
    let a;

    if (transcript?.includes(order)) {
      a = "highlightedColorStyle";
    } else {
      a = "normalColorStyle";
    }
    return a;
  }

  public highlightMatchedScriptLines(element: Script): string {
    const script = this.calls.scriptOrderIds$.value;
    let b;

    if (script?.includes(element?.order)) {
      b = "highlightedColorStyle";
    } else {
      b = "normalColorStyle";
    }

    if (
      element &&
      element.similarity &&
      element?.order === this.matchedSentenceLine &&
      this.highlightMatchingScript &&
      element.similarity * 100 >= this.calls.matchValue.value!
    ) {
      b = "matchedColorStyle";
    }
    return b;
  }

  public toolTipData(element: Script): string {
    if (
      element.similarity &&
      element.matchingSentence &&
      this.matchedSentenceLine
    ) {
      const lineNumber = this.matchedSentenceLine + 1;
      return (
        element.similarity * 100 +
        "% " +
        "match with #line" +
        lineNumber +
        " " +
        '"' +
        element.matchingSentence +
        '"'
      );
    }
    return "No matching sentence";
  }

  public toggleToolTip(element: Script): boolean {
    let tooglestate = true;
    if (this.calls.matchValue.value && element.similarity) {
      if (element.similarity * 100 >= this.calls.matchValue.value) {
        tooglestate = false;
      } else {
        tooglestate = true;
      }
    }
    return tooglestate;
  }
}
