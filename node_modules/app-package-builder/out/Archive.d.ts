import { Folder } from "./Folder";
import { SevenZArchiveEntry } from "./SevenZArchiveEntry";
import { SubStreamsInfo } from "./SevenZFile";
export declare class Archive {
    packPosition: number;
    packedSizes: Array<number>;
    folders: Array<Folder>;
    subStreamsInfo: SubStreamsInfo;
    files: Array<SevenZArchiveEntry>;
    streamMap: StreamMap;
    headerSize: number;
}
export declare class StreamMap {
    packStreamOffsets: Array<number>;
    folderFirstFileIndex: Array<number>;
    toString(): string;
}
