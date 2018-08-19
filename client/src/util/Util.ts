/**
 * Shared utility functions.
 */

import {Consts} from './Consts';

/**
 * Checks if the file has a valid MIME type
 *
 * @param file File to check for the MIME type validity
 * @returns true if file has a valid MIME type or false otherwise
 */
export function acceptFile(file: File): boolean {
  return accepts(file, Consts.ACCEPTED_MIME_TYPES);
}

/**
 * Checks if the file has a valid MIME type
 * (translated to TypeScript fron attr-accept package)
 *
 * @param file File to check for the MIME type validity
 * @param acceptedFiles comma-separated list of accepted file MIME types
 * @returns true if file has an accepted  MIME type or false otherwise
 */
function accepts(file: File, acceptedFiles: string): boolean {
  if (file && acceptedFiles) {
    const acceptedFilesArray: string[] = acceptedFiles.split(',');
    const fileName: string = file.name || '';
    const mimeType: string = file.type || '';
    const baseMimeType: string = mimeType.replace(/\/.*$/, '');

    return acceptedFilesArray.some((acceptedType: string) => {
      const validType: string = acceptedType.trim();
      if (validType.charAt(0) === '.') {
        return fileName.toLowerCase().endsWith(validType.toLowerCase());
      } else if (validType.endsWith('/*')) {
        // This is something like a image/* mime type
        return baseMimeType === validType.replace(/\/.*$/, '');
      }

      return mimeType === validType;
    });
  }

  return true;
}
