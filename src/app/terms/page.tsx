
/**
 * 利用規約ページ
 * @returns 利用規約ページ
 */
export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">利用規約</h1>

      <div className="prose prose-green max-w-none">
        <p className="text-gray-700 mb-8">
          本利用規約（以下「本規約」といいます）は、ファミリーパークシェア（以下「本アプリ」といいます）の利用条件を定めるものです。本アプリはポートフォリオ目的で制作されたものであり、実際のサービス提供を行うものではありません。
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">第1条（適用範囲）</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>
              本規約は、本アプリの利用に関する条件を、本アプリを利用するすべての方（以下「ユーザー」といいます）と本アプリ開発者との間で定めるものです。
            </li>
            <li>ユーザーが本アプリを利用した場合、本規約に同意したものとみなします。</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">第2条（ポートフォリオとしての利用）</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>
              本アプリは開発者のポートフォリオとして制作されたものであり、実際のサービス提供や商用利用を目的としたものではありません。
            </li>
            <li>
              本アプリのデータや情報は実際のものとは異なる場合があり、正確性を保証するものではありません。
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">第3条（アカウント登録）</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>
              ユーザーは、本アプリの一部機能を利用するためにアカウント登録をする必要があります。
            </li>
            <li>ユーザーは、登録情報に個人を特定できる本名などを使用しないことを推奨します。</li>
            <li>
              パスワードの管理はユーザー自身の責任で行うものとし、第三者に漏洩しないよう管理してください。
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">第4条（禁止事項）</h2>
          <p className="text-gray-700 mb-4">
            ユーザーは、本アプリの利用にあたり、以下の行為を行わないものとします。
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>法令または公序良俗に違反する行為</li>
            <li>犯罪に関連する行為</li>
            <li>本アプリの運営を妨げる行為</li>
            <li>他のユーザーに迷惑をかける行為</li>
            <li>他人になりすます行為</li>
            <li>他のユーザーの個人情報を収集する行為</li>
            <li>本アプリを商用目的で利用する行為</li>
            <li>
              著作権、肖像権、プライバシー権などの他者の権利を侵害する画像や情報を投稿する行為
            </li>
            <li>
              公序良俗に反する画像（わいせつ、暴力的、差別的な内容を含む画像等）を投稿する行為
            </li>
            <li>虚偽の情報や、第三者に誤解や混乱を与えるような公園情報やレビューを投稿する行為</li>
            <li>その他、開発者が不適切と判断する行為</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">第5条（著作権）</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>本アプリに関する著作権、その他の知的財産権は開発者に帰属します。</li>
            <li>
              ユーザーが本アプリに投稿したコンテンツ（文章、画像等）の著作権はユーザー自身に帰属します。ただし、ユーザーは、当該コンテンツを本アプリ上で利用することを開発者に許諾するものとします。
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">第6条（位置情報の利用）</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>
              本アプリは、近くの公園を検索する機能のために、ユーザーの位置情報（GPS情報）を利用します。
            </li>
            <li>
              位置情報の利用はユーザーの同意を得た場合のみ行われ、ユーザーはいつでも端末の設定から位置情報の利用を制限することができます。
            </li>
            <li>
              取得した位置情報は検索機能の提供のみを目的として使用され、他の目的での利用や第三者への提供は行いません。
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">第7条（免責事項）</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>
              本アプリはポートフォリオ目的で制作されたものであり、サービスの継続性やデータの保全を保証するものではありません。
            </li>
            <li>
              開発者は、本アプリの利用によりユーザーに生じたいかなる損害についても責任を負いません。
            </li>
            <li>
              本アプリに掲載される情報の正確性、完全性、有用性等について保証するものではありません。
            </li>
            <li>
              公園情報やレビューはユーザーによって投稿されるものであり、その内容の正確性について開発者は一切の責任を負いません。
            </li>
            <li>GPS機能による位置情報は、端末や環境により誤差が生じる場合があります。</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">第8条（ユーザープロフィール）</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>ユーザーは、本アプリにプロフィール情報を登録・編集することができます。</li>
            <li>
              プロフィール情報に個人を特定できる情報（本名、住所、電話番号等）を登録しないようお願いします。
            </li>
            <li>
              プロフィール情報として不適切な内容（公序良俗に反する内容、他者を誹謗中傷する内容等）を設定することはできません。
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">第9条（本規約の変更）</h2>
          <p className="text-gray-700">
            開発者は、必要と判断した場合には、ユーザーに通知することなく本規約を変更することがあります。変更後の利用規約は、本アプリ上に表示した時点で効力を生じるものとします。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">第10条（準拠法・管轄裁判所）</h2>
          <p className="text-gray-700">
            本規約の解釈にあたっては、日本法を準拠法とします。本アプリに関して紛争が生じた場合には、開発者の所在地を管轄する裁判所を専属的合意管轄とします。
          </p>
        </section>

        <div className="text-right text-gray-500 mt-12">
          <p>以上</p>
          <p>最終更新日：2024年4月1日</p>
        </div>
      </div>
    </div>
  );
}
