import Link from 'next/link';
import React from 'react';
import { ChevronDown } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-background-secondary mt-auto">
      <div className="container mx-auto max-w-screen-lg px-4 py-4">
        {/* PC表示用 */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {/* サイト情報 */}
          <div className="space-y-2">
            <Link href="/" className="block">
              <h2 className="text-lg font-bold text-primary hover:opacity-80 transition-opacity">
                FAMILY PARK SHARE
              </h2>
            </Link>
            <p className="text-text-secondary text-xs">家族で楽しめる公園を探そう</p>
          </div>

          {/* 使い方・ヘルプ */}
          <div className="justify-self-center">
            <h3 className="font-semibold mb-2 text-sm">使い方・ヘルプ</h3>
            <ul>
              <li>
                <Link href="/about" className="text-text-secondary hover:text-primary text-sm">
                  サービス概要
                </Link>
              </li>
            </ul>
          </div>

          {/* プライバシーと利用規約 */}
          <div className="justify-self-center">
            <h3 className="font-semibold mb-2 text-sm">プライバシーと利用規約</h3>
            <ul className="space-y-1">
              <li>
                <Link href="/privacy" className="text-text-secondary hover:text-primary text-sm">
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-text-secondary hover:text-primary text-sm">
                  利用規約
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* モバイル表示用 */}
        <div className="md:hidden space-y-3">
          <div className="text-center mb-4">
            <Link href="/" className="block">
              <h2 className="text-lg font-bold text-primary hover:opacity-80 transition-opacity">
                FAMILY PARK SHARE
              </h2>
            </Link>
            <p className="text-text-secondary text-xs">家族で楽しめる公園を見つけよう</p>
          </div>

          {[
            {
              title: '使い方・ヘルプ',
              links: [{ href: '/about', label: 'サービス概要' }],
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
              <summary className="flex items-center justify-between py-1 px-2 bg-background-secondary rounded-lg cursor-pointer">
                <span className="font-semibold text-sm">{section.title}</span>
                <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
              </summary>
              <div className="py-1 px-2 space-y-1">
                {section.links.map((link) => (
                  <li key={link.href} className="list-none">
                    <Link
                      href={link.href}
                      className="text-text-secondary hover:text-primary text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </div>
            </details>
          ))}
        </div>

        {/* コピーライト */}
        <div className="border-t border-border mt-4 pt-4 text-center">
          <p className="text-xs text-gray-500">© 2025 FAMILY PARK SHARE.</p>
        </div>
      </div>
    </footer>
  );
}
