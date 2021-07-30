import { Injectable } from "@angular/core";
import { ObjectMapper } from "json-object-mapper";

import { Observable, of } from "rxjs";

import Call from "src/app/core/models/call.model";
import Transcript from "src/app/core/models/transcript.model";
import Script from "../../models/script.model";
import MOCK_DATA_CALLS from "./data/calls.json";
import MOCK_DATA_TRANSCRIPT from "./data/transcript.json";

@Injectable()
export default class CallServiceMock {
  getCalls$(): Observable<Call[]> {
    return of(ObjectMapper.deserializeArray(Call, MOCK_DATA_CALLS));
  }

  getTranscripts$(): Observable<Transcript[]> {
    let scripts = MOCK_DATA_TRANSCRIPT.map((script: string) => {
      let deserializedScript: Transcript = ObjectMapper.deserialize(
        Transcript,
        script
      );
      deserializedScript.script = ObjectMapper.deserializeArray(
        Script,
        deserializedScript.script
      );
      deserializedScript.transcript = ObjectMapper.deserializeArray(
        Script,
        deserializedScript.transcript
      );
      return deserializedScript;
    });
    return of(scripts);
  }
}
