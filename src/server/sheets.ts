import _ from 'lodash';
import {TranslationLineWithResourceId} from './types/SCI';
import { packTranslation } from './msg/pack';
import { gzip } from 'pako';
import { tar } from './utils/tinytar/tar';
import { bytesToBase64 } from './utils/base64';

const SHEET_NAME = 'Raw data';

export function packTranslations() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  if (!sheet) {
    throw new Error(`Could not find sheet with name "${SHEET_NAME}"`);
  }

  const values = sheet.getRange('A:L').getValues().slice(1);

  return _.chain(values)
    .map((row, index, rows): TranslationLineWithResourceId => ({
      resource: numberify(row, 0, index, rows),
      noun: numberify(row, 1, index, rows),
      verb: numberify(row, 2, index, rows),
      condition: numberify(row, 3, index, rows),
      sequence: numberify(row, 4, index, rows),
      talker: numberify(row, 5, index, rows),
      refNoun: numberify(row, 6, index, rows),
      refVerb: numberify(row, 7, index, rows),
      refCond: numberify(row, 8, index, rows),
      text: String(row[10] || row[9] || ''),
    }))
    .groupBy('resource')
    .mapValues((records) => packTranslation(records, {
      encoding: 'win1255',
    }))
    .entries()
    .map(([resourceId, data]) => ({
      name: `PATCHES/${resourceId}.MSG`,
      data,
    }))
    .concat({
      name: 'HEBREW',
      data: new Uint8Array(0),
    })
    .thru(files => {
      const tape = tar(files);
      const compressed = gzip(tape);
      return bytesToBase64(compressed);
    })
    .value();
}

function numberify(row, columnIndex, rowIndex, rows) {
  const cell = row[columnIndex]
  if (cell == null || cell === '') {
    const previousIndex = rowIndex - 1;
    return numberify(rows[previousIndex], columnIndex, previousIndex, rows);
  }

  return +cell;
}
