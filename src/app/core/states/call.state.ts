import { Injectable } from "@angular/core";

import { BehaviorSubject, Subject } from "rxjs";
import AgentFacade from "src/app/core/facades/agent.facade";
import Agent from "src/app/core/models/agent";

import Call from "src/app/core/models/call.model";
import Transcript from "src/app/core/models/transcript.model";
import CallService from "src/app/core/services/call.service";

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
  public matchingPercentage$ = this._matchingPercentage$.asObservable();
  isLoading$ = new BehaviorSubject<boolean>(true);

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
    setTimeout(() => {
      this._activeTranscript$.next(transcript);
    }, 10);
    this.isLoading$.next(false);
    console.log(id, transcript);
  }

  public setMatchingPercentage(value: number | null): void {
    this._matchingPercentage$.next(parseInt(`${value}`));
    console.log("Matching %", value);
  }
}
