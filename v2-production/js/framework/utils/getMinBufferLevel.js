"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMinBufferLevel = getMinBufferLevel;
function getMinBufferLevel(player) {
    var playerDuration = player.getDuration();
    var videoBufferLength = player.getVideoBufferLength();
    var audioBufferLength = player.getAudioBufferLength();
    // Calculate the buffer length which is the smaller length of the audio and video buffers. If one of these
    // buffers is not available, we set it's value to MAX_VALUE to make sure that the other real value is taken
    // as the buffer length.
    var bufferLength = Math.min(videoBufferLength != null ? videoBufferLength : Number.MAX_VALUE, audioBufferLength != null ? audioBufferLength : Number.MAX_VALUE);
    // If both buffer lengths are missing, we set the buffer length to zero
    if (bufferLength === Number.MAX_VALUE) {
        bufferLength = 0;
    }
    return (100 / playerDuration) * bufferLength;
}
