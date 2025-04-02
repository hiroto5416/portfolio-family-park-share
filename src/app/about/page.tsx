import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">サービス概要</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">ファミリーパークシェアとは</h2>
        <p className="text-gray-700 leading-relaxed">
          ファミリーパークシェアは、子供を連れて遊びたい親やファミリー層向けの公園情報共有アプリです。
          「どの公園に行けばいいかわからない」「他の家族の意見やおすすめを知りたい」といった子育て家族の悩みを解決します。
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">主な機能</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium mb-2">公園検索・閲覧機能</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>GPS機能を活用した近くの公園検索</li>
              <li>公園名、住所、キーワードでの検索</li>
              <li>地図表示による直感的な公園探し</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">コミュニティ機能</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>公園の写真投稿（最大5枚まで）</li>
              <li>レビュー投稿（最大1000文字）</li>
              <li>「いいね」機能による評価システム</li>
              <li>家族同士の情報交換の場を提供</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">公園情報</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>公園の基本情報（名称、住所、営業時間など）</li>
              <li>施設情報（遊具、トイレ、駐車場など）</li>
              <li>写真ギャラリーによる視覚的な情報提供</li>
              <li>最新のレビューが優先表示される仕組み</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">ご利用方法</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>新規登録/ログイン</li>
          <li>公園を検索（GPSを使った近くの公園検索も可能）</li>
          <li>公園の詳細情報を閲覧（写真・口コミ）</li>
          <li>公園訪問後、写真やレビューを投稿</li>
          <li>他のユーザーの投稿に「いいね」で評価</li>
        </ol>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">開発者情報</h2>
        <p className="text-gray-700 mb-4">
          本アプリはポートフォリオ作品として個人が開発したものです。
        </p>
        <dl className="space-y-2 text-gray-700">
          <div className="flex">
            <dt className="w-32">開発者</dt>
            <dd>Kitta</dd>
          </div>
          <div className="flex">
            <dt className="w-32">メール</dt>
            <dd>
              <a href="mailto:kitta.daiki.dc@gmail.com" className="text-primary hover:underline">
                kitta1213@gmail.com
              </a>
            </dd>
          </div>
          <div className="flex">
            <dt className="w-32">GitHub</dt>
            <dd>
              <a
                href="https://github.com/hiroto5416"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                https://github.com/hiroto5416
              </a>
            </dd>
          </div>
        </dl>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">利用規約・プライバシーポリシー</h2>
        <div className="space-y-2">
          <div>
            <Link href="/terms" className="text-primary hover:underline">
              利用規約
            </Link>
          </div>
          <div>
            <Link href="/privacy" className="text-primary hover:underline">
              プライバシーポリシー
            </Link>
          </div>
        </div>
      </section>

      <footer className="text-center text-gray-500 text-sm">
        © 2024 ファミリーパークシェア All Rights Reserved.
      </footer>
    </div>
  );
}
