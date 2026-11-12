export class BlockOutOfLimitsException extends Error {
  constructor(text: string) {
    super(text);
    this.name = 'BlockOutOfLimitsException';
  }
}
