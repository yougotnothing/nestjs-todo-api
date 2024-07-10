import { UUID } from "crypto";

export interface JwtTokenKeys {
  name: string;
  sub: UUID;
}