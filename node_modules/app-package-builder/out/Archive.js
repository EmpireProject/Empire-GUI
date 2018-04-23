"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
class Archive {}
exports.Archive = Archive;
class StreamMap {
    // Index of folder for each file.
    // fileFolderIndex: Array<number>
    toString() {
        return `StreamMap, offsets of ${this.packStreamOffsets.length} packed streams, first files of ${this.folderFirstFileIndex.length} folders`;
    }
}
exports.StreamMap = StreamMap; //# sourceMappingURL=Archive.js.map