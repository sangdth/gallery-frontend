/* eslint-disable no-console */
import { IS_DEV } from './constants';

export default function logger(message: string, ...args: any[]) {
  if (IS_DEV) {
    console.log(`> ${message}: `, ...args);
  }
}
