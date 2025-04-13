
/**
 * プライバシーポリシーページ
 * @returns プライバシーポリシーページ
 */
export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">プライバシーポリシー</h1>

      <div className="prose prose-green max-w-none">
        <p className="text-gray-700 mb-8">
          本プライバシーポリシーは、ファミリーパークシェア（以下「本アプリ」といいます）における、ユーザーの個人情報の取り扱いについて定めるものです。本アプリはポートフォリオ目的で制作されたものであり、実際のサービス提供を行うものではありません。
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. 収集する情報</h2>
          <p className="text-gray-700 mb-4">本アプリでは、以下の情報を収集する場合があります：</p>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium mb-2">1.1 ユーザーが提供する情報</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>アカウント情報（メールアドレス、パスワード）</li>
                <li>プロフィール情報（ユーザー名、アイコン画像）</li>
                <li>ユーザーが投稿する内容（公園レビュー、画像）</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">1.2 自動的に収集される情報</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>位置情報（GPS）：近くの公園を検索する機能のために使用</li>
                <li>利用状況に関する情報（アクセス日時、利用機能、アプリの動作ログ）</li>
                <li>デバイス情報（OSのバージョン、デバイスの種類）</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. 情報の利用目的</h2>
          <p className="text-gray-700 mb-4">収集した情報は、以下の目的のために利用します：</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>アカウント作成・管理</li>
            <li>本アプリの機能提供（公園検索、レビュー表示など）</li>
            <li>本アプリの品質向上、不具合対応</li>
            <li>ユーザーへの通知の送信（必要な場合）</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. 情報の共有・第三者提供</h2>
          <p className="text-gray-700 mb-4">
            本アプリはポートフォリオ目的で制作されたものであり、収集した情報を第三者に提供することはありません。ただし、以下の場合には例外として情報を開示することがあります：
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>法令に基づく場合</li>
            <li>ユーザーの同意がある場合</li>
            <li>人の生命、身体または財産の保護のために必要がある場合</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. 情報の保管とセキュリティ</h2>
          <p className="text-gray-700">
            収集した情報は、適切なセキュリティ対策を実施し保護します。ただし、本アプリはポートフォリオ目的で制作されたものであり、データの永続的な保存や完全なセキュリティを保証するものではありません。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. 位置情報の取り扱い</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium mb-2">5.1 位置情報の利用</h3>
              <p className="text-gray-700">
                本アプリでは、近くの公園を検索する機能のために位置情報を利用します。位置情報の利用はユーザーの同意を得た場合のみ行われ、ユーザーはいつでも端末の設定から位置情報の利用を制限することができます。
              </p>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">5.2 位置情報の保存</h3>
              <p className="text-gray-700">
                現在地から検索を行う際に取得する位置情報は、検索処理のためにのみ一時的に利用され、保存はされません。
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. ユーザーの権利</h2>
          <p className="text-gray-700 mb-4">ユーザーは以下の権利を有します：</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>自己の個人情報へのアクセス権</li>
            <li>個人情報の訂正・削除を求める権利</li>
            <li>アカウントの削除を求める権利</li>
          </ul>
          <p className="text-gray-700 mt-4">
            これらの権利を行使したい場合は、下記の連絡先までご連絡ください。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Cookieの使用</h2>
          <p className="text-gray-700">
            本アプリでは、ユーザー体験の向上やセッション管理のために、Cookieまたは類似の技術を使用する場合があります。ユーザーはブラウザの設定からCookieを無効にすることができますが、その場合一部の機能が利用できなくなる可能性があります。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. 子どものプライバシー</h2>
          <p className="text-gray-700">
            本アプリは、13歳未満の子どもを対象としていません。13歳未満の子どもから意図的に個人情報を収集することはありません。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. プライバシーポリシーの変更</h2>
          <p className="text-gray-700">
            本プライバシーポリシーは、必要に応じて変更されることがあります。重要な変更がある場合は、本アプリ上で通知します。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. お問い合わせ</h2>
          <p className="text-gray-700 mb-4">
            本プライバシーポリシーに関するご質問やご意見は、以下の連絡先までお願いします：
          </p>
          <dl className="space-y-2 text-gray-700">
            <div className="flex">
              <dt className="w-32">開発者</dt>
              <dd>Kitta</dd>
            </div>
            <div className="flex">
              <dt className="w-32">メール</dt>
              <dd>
                <a href="mailto:kitta1213@gmail.com" className="text-primary hover:underline">
                  kitta1213@gmail.com
                </a>
              </dd>
            </div>
          </dl>
        </section>

        <div className="text-right text-gray-500 mt-12">
          <p>以上</p>
          <p>最終更新日：2024年4月1日</p>
        </div>
      </div>
    </div>
  );
}
