import { UUID } from "crypto";

export interface Session {
	user_id: UUID;
	connect: string;
}