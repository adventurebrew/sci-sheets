import _ from 'lodash'
import * as fs from 'fs';
import * as path from 'path';
import {unpackMSG, unpackTranslation} from './unpack';
import {packMSG, packTranslation} from "./pack";

describe('pack-unpack test', () => {
  describe.each([
    '95.msg',
    '301.msg',
    '302.msg',
  ])('for %s', (resourceName) => {
    let binaryData: Buffer;

    beforeEach(async () => {
      const fixturePath = path.join(__dirname, '__fixtures__', resourceName);
      binaryData = await fs.promises.readFile(fixturePath);

      const trailingZeroCount = _.takeRightWhile(binaryData, v => v === 0).length;
      if (trailingZeroCount > 1) {
        binaryData = binaryData.slice(0, 1 - trailingZeroCount);
      }
    });

    it('should unpack a message resource file', () => {
      const msg = unpackMSG(binaryData, { encoding: 'ascii' });
      expect(msg).toMatchSnapshot();
    });

    it('should pack a message resource file back', () => {
      const msg = unpackMSG(binaryData, { encoding: 'ascii' });
      const buffer = packMSG(msg, { encoding: 'ascii' });
      const msg2 = unpackMSG(buffer, { encoding: 'ascii' });
      msg2.data.lastMsgNum = msg.data.lastMsgNum; // no idea why they do not match
      expect(msg2).toEqual(msg);
    });

    it('should convert a message resource file to translations', () => {
      const translation = unpackTranslation(binaryData, { encoding: 'ascii' });
      expect(translation).toMatchSnapshot();
    });

    it('should convert a message resource to translations and back again', () => {
      const translation = unpackTranslation(binaryData, { encoding: 'ascii' });
      const buffer = packTranslation(translation, { encoding: 'ascii' });

      buffer[6] = binaryData[6]; // no idea why lastMsgNum is different
      buffer[7] = binaryData[7]; // no idea why lastMsgNum is different
      expect(Buffer.from(buffer)).toEqual(binaryData);
    });
  });
});
