declare module 'heic2any' {
  /**
   * heic2anyのオプション
   */
  interface Heic2anyOptions {
    blob: Blob;
    toType: string;
    quality?: number;
  }

  /**
   * heic2anyの関数
   * @param options オプション
   * @returns バッファ
   */
  function heic2any(options: Heic2anyOptions): Promise<Blob>;

  export default heic2any;
}
