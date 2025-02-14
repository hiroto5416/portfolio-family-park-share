import Link from 'next/link';
import React from 'react';
import { ChevronDown } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-background-secondary mt-auto">
      <div className="container mx-auto max-w-screen-lg px-4 py-6">
        {/* PC表示用 */}
        <div className="hidden md:grid md:grid-cols-4 gap-8">
          {/* サイト情報 */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-primary">FAMILY PARK SHARE</h2>
            <p className="text-text-secondary text-sm">家族で楽しめる公園を探そう</p>
          </div>

          {/* サービスについて */}
          <div>
            <h3 className="font-semibold mb-4">サービスについて</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-text-secondary hover:text-primary">
                  サービス概要
                </Link>
              </li>
            </ul>
          </div>

          {/* お問い合わせ */}
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

          {/* プライバシーと利用規約 */}
          <div>
            <h3 className="font-semibold mb-4">プライバシーと利用規約</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-text-secondary hover:text-primary">
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-text-secondary hover:text-primary">
                  利用規約
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* モバイル表示用 */}
        <div className="md:hidden space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-primary">FAMILY PARK SHARE</h2>
            <p className="text-text-secondary text-sm">家族で楽しめる公園を探そう</p>
          </div>

          {[
            {
              title: 'サービスについて',
              links: [{ href: '/about', label: 'サービス概要' }],
            },
            {
              title: 'お問い合わせ',
              links: [
                { href: '/contact', label: 'お問い合わせフォーム' },
                { href: '/faq', label: 'よくある質問' },
              ],
            },
            {
              title: 'プライバシーと利用規約',
              links: [
                { href: '/privacy', label: 'プライバシーポリシー' },
                { href: '/terms', label: '利用規約' },
              ],
            },
          ].map((section) => (
            <details key={section.title} className="group">
              <summary className="flex items-center justify-between p-1 bg-background-secondary rounded-lg cursor-pointer">
                <span className="font-semibold">{section.title}</span>
                <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
              </summary>
              <div className="p-1 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href} className="list-none">
                    <Link href={link.href} className="text-text-secondary hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </div>
            </details>
          ))}
        </div>

        {/* コピーライト */}
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p>© 2024 FAMILY PARK SHARE.</p>
        </div>
      </div>
    </footer>
  );
}
