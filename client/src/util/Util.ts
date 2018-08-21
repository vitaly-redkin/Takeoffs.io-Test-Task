/**
 * Shared utility functions.
 */

import { Consts } from './Consts';
import { ISize } from './CommonTypes';

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
 * Removes prefix the FileReader class adds to Base64 encoded files.
 * 
 * @param content Base64-encoded string with prefix
 * @returns Base64-encoded string without prefix
 */
export function stripBase64ImagePrefix(content: string): string {
  const base64: string = ';base64,';
  const index: number = content.indexOf(base64);
  if (index > 0) {
    return content.substring(index + base64.length);
  } else {
    return content;
  }
}

/**
 * Adds prefix to Base64 encoded file content.
 * 
 * @param content Base64-encoded string without prefix
 * @returns Base64-encoded string with prefix
 */
export function addBase64ImagePrefix(content: string): string {
  return `data:image/png;base64,${content}`;
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

/**
 * Returns promise with the give image size.
 * 
 * @param base64 Base64 encoded PNG image (with prefix)
 * @returns promise with the give image size
 */
export async function getImageSize(base64: string): Promise<ISize> {
  const src: string = addBase64ImagePrefix(base64);

  return new Promise<ISize> ((resolved: Function) => {
    const img = new Image();
    img.onload = () => {
      resolved({width: img.width, height: img.height});
    };
    img.src = src;
  });
}
