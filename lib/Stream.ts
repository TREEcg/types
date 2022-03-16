import { Member } from "./Member";

// Write members to somewhere
export interface StreamWriter {
    write(member: Member): Promise<void>;
}

// A stream generating Members
export interface StreamReader {
    on(event: "data", listener: (member: Member) => Promise<void>): this;
    on(event: "end", listener: () => Promise<void>): this;
    on(event: "metadata", listener: (metadata: any) => Promise<void>): this;
}
