import { Injectable } from "@angular/core";

import { BehaviorSubject, Subject } from "rxjs";
import AgentFacade from "src/app/core/facades/agent.facade";
import Agent from "src/app/core/models/agent";

import Call from "src/app/core/models/call.model";
import Transcript from "src/app/core/models/transcript.model";
import CallService from "src/app/core/services/call.service";
import Script from "../models/script.model";

@Injectable({ providedIn: "root" })
export default class CallState {
  private readonly _activeAgentCalls$ = new BehaviorSubject<Call[]>([]);
  private readonly _activeTranscript$ = new Subject<Transcript>();
  private readonly _calls$ = new BehaviorSubject<Call[]>([]);
  private readonly _matchingPercentage$ = new BehaviorSubject<number>(0);
  private readonly _transcripts$ = new BehaviorSubject<Transcript[]>([]);
  public activeAgentCalls$ = this._activeAgentCalls$.asObservable();
  public activeTranscript$ = this._activeTranscript$.asObservable();
  public calls$ = this._calls$.asObservable();
  public activeScript$ = new BehaviorSubject<Script[] | undefined>([]);
  public matchingPercentage$ = this._matchingPercentage$.asObservable();
  public isLoading$ = new BehaviorSubject<boolean>(true);
  public transcriptOrderIds$ = new BehaviorSubject<number[] | undefined>([]);
  public scriptOrderIds$ = new BehaviorSubject<number[] | undefined>([]);
  public matchedTranscript: Transcript | undefined;
  public matchValue = new BehaviorSubject<number | null>(0);

  constructor(
    private readonly _svc: CallService,
    private readonly _agents: AgentFacade
  ) {
    this._svc
      .getCalls$()
      .subscribe((calls: Call[]) => this._calls$.next(calls));

    this._svc.getTranscripts$().subscribe((transcripts: Transcript[]) => {
      this._transcripts$.next(transcripts);
      console.log(transcripts, "id");
    });

    this._agents.activeAgent$.subscribe((agent: Agent) => {
      const calls = this._calls$.value.filter(
        (call: Call) => call.agent?.agentId === agent.id
      );
      this._activeAgentCalls$.next(calls);
    });
  }

  public selectCall(id: string): void {
    const transcript = this._transcripts$.value.find(
      (transcript: Transcript) => transcript.id === id
    );
    this.matchedTranscript = transcript;
    setTimeout(() => {
      this._activeTranscript$.next(transcript);
    }, 10);
    this.isLoading$.next(false);
  }

  public getMatchingScriptsOrderIds(
    script: Script[] | undefined,
    value: number | null
  ): number[] | undefined {
    let selectedScript;
    if (value) {
      selectedScript = script
        ?.filter((i) => i && i.similarity && i.similarity * 100 >= value)
        .map((i) => i.order);
    }
    return selectedScript;
  }

  public setMatchingPercentage(value: number | null): void {
    this.matchValue.next(value);
    this._matchingPercentage$.next(parseInt(`${value}`));
    const transcript = this.matchedTranscript?.transcript;
    const script = this.matchedTranscript?.script;
    this.activeScript$.next(script);

    const transcriptOrderIds = this.getMatchingScriptsOrderIds(
      transcript,
      value
    );
    const scriptOrderIds = this.getMatchingScriptsOrderIds(script, value);

    this.transcriptOrderIds$.next(transcriptOrderIds);
    this.scriptOrderIds$.next(scriptOrderIds);
  }
}
