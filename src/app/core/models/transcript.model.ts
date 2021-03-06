import { JsonProperty } from "json-object-mapper";
import Channel from "src/app/core/models/channel.model";
import Script from "src/app/core/models/script.model";

export default class Transcript {
  @JsonProperty({ type: Channel })
  public agent: Channel | null;
  @JsonProperty({ type: Channel })
  public customer: Channel | null;
  @JsonProperty()
  public duration: number | null;
  @JsonProperty({ name: "call_id" })
  public id: string | null;
  @JsonProperty()
  public script: Script[];
  @JsonProperty({
    name: "call_datetime",
    type: Date,
  })
  public time: Date | null;
  @JsonProperty()
  public transcript: Script[];
  @JsonProperty({ name: "calltype_id" })
  public type: string | null;

  constructor() {
    this.agent = null;
    this.customer = null;
    this.duration = null;
    this.id = null;
    this.script = [];
    this.time = null;
    this.transcript = [];
    this.type = null;
  }

  getSpeaker(channel: number): string | number | null {
    if (channel === this.agent?.channel) {
      let speakerName;
      if (this.agent?.speakerName && this.agent?.speakerName !== "") {
        speakerName = this.agent?.speakerName?.split(" ", 1).join(" ");
      } else if (speakerName === null) {
        speakerName = "unknown";
      } else {
        speakerName = "unknown";
      }
      return speakerName;
    } else if (channel === this.customer?.channel) {
      let customerName;
      if (this.customer?.speakerName) {
        customerName = this.customer?.speakerName?.split(" ", 1).join(" ");
      } else if (customerName === null) {
        customerName = "unknown";
      } else {
        customerName = "unknown";
      }
      return customerName;
    }
    return null;
  }
}
