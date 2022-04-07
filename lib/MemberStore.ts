import { Metadata } from "./Fragment";
import { Member } from "./Member";

// Write members to somewhere
export interface MemberStore {
    write(member: Member): Promise<void>;
    writeMetadata(metadata: Metadata): Promise<void>;
}
