"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupPlaybackSuspensionReason = void 0;
/**
 * The Group Playback API offers control over synchronized playback of a group of clients, e.g. for Apple SharePlay
 * sessions.

 * Note: The API currently only covers the immediate needs of the iOS SDK in combination with our UI which is regarding
 * temporarily suspending synchronization of the player from the group. But it is open to be extended as needed in the
 * future.
 */
/**
 * Reason for suspending the synchronization with the group.
 */
var GroupPlaybackSuspensionReason;
(function (GroupPlaybackSuspensionReason) {
    GroupPlaybackSuspensionReason["UserIsScrubbing"] = "userIsScrubbing";
})(GroupPlaybackSuspensionReason || (exports.GroupPlaybackSuspensionReason = GroupPlaybackSuspensionReason = {}));
