// Wake word detection utility using Picovoice Porcupine Web SDK
// https://picovoice.ai/docs/quick-start/porcupine-web/

import { PorcupineWorker } from '@picovoice/porcupine-web';
import { WebVoiceProcessor } from '@picovoice/web-voice-processor';

const ACCESS_KEY = 'niwp1YTZOZxITVxS+XLKB8vc8fXMDJy034s2Hw5nJdNoVsZMH013iA==';
const MODEL_PATH = '/porcupine_params.pv';
const KEYWORD_PATH = '/Hey-Robby.ppn';

const keywordModel = {
  publicPath: KEYWORD_PATH,
  label: 'Hey Robby',
  sensitivity: 0.7,
};

export async function startWakeWord(onDetection: (label: string) => void) {
  const porcupine = await PorcupineWorker.create(
    ACCESS_KEY,
    [keywordModel],
    detection => {
      onDetection(detection.label);
    },
    { publicPath: MODEL_PATH }
  );
  await WebVoiceProcessor.subscribe(porcupine);
  return porcupine;
}
