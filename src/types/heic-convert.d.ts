/**
 * heic-convertの型定義
 */
declare module 'heic-convert' {
  interface ConvertOptions {
    buffer: Buffer;
    format: 'JPEG' | 'PNG';
    quality?: number;
  }

  /**
   * heic-convertの関数
   * @param options オプション
   * @returns バッファ
   */
  function convert(options: ConvertOptions): Promise<Buffer>;
  export default convert;
}
