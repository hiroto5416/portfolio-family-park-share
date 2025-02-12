import Link from 'next/link';
import React from 'react';

export function Footer() {
  return (
    <footer className="bg-background-secondary mt-auto ">
      <div className="container mx-auto max-w-screen-lg px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* サイト情報 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-primary">FAMILY PARK SHARE</h2>
            <p className="text-text-secondary text-sm">家族で楽しめる公園を探そう</p>
          </div>

          {/* リンクナビゲーション */}
          <div>
            <h3 className="font-semibold mb-4">サービスについて</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-text-secondary hover:text-primary">
                  サービス概要
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-text-secondary hover:text-primary">
                  利用規約
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-text-secondary hover:text-primary">
                  プライバリーポリシー
                </Link>
              </li>
            </ul>
          </div>

          {/* お問い合わせセクション */}
          <div>
            <h3 className="font-semibold mb-4">お問い合わせ</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-text-secondary hover:text-primary">
                  お問い合わせフォーム
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-text-secondary hover:text-primary">
                  よくある質問
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* コピーライト */}
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p>© 2024 FAMILY PARK SHARE.</p>
        </div>
      </div>
    </footer>
  );
}
