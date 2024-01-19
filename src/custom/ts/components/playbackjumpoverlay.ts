import {Container, ContainerConfig} from '../../../ts/components/container';
import {PlaybackForwardButton, PlaybackRewindButton} from './playbackjumpbutton';

export interface PlaybackJumpControlsOverlayConfig extends ContainerConfig {}

/**
 * Overlay containing the playback forward and rewind buttons.
 */
export class PlaybackJumpControlsOverlay extends Container<PlaybackJumpControlsOverlayConfig> {

  private forwardButton: PlaybackForwardButton;
  private rewindButton: PlaybackRewindButton;

  constructor(config: PlaybackJumpControlsOverlayConfig = {}) {
    super(config);

    this.forwardButton = new PlaybackForwardButton({ skipTime: 10 });
    this.rewindButton = new PlaybackRewindButton({ skipTime: -10 });

    this.config = this.mergeConfig(config, {
      cssClass: 'ui-playbackforward-overlay',
      components: [this.forwardButton, this.rewindButton],
    }, this.config);
  }
}
