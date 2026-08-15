# company-introduction-jp

日本の会社紹介スライドのまとめ。

## ウェブサイト

次のURLから、会社ごとのスライドの一覧を確認できます。

- <https://company-introduction-jp.vercel.app/>

### RSSフィード

次のURLから、新しい会社紹介スライドの追加をRSSで購読できます。

- <https://company-introduction-jp.vercel.app/rss/new>

### API

会社の一覧をJSONで返します。

- <https://company-introduction-jp.vercel.app/api/company>

## 会社紹介スライドの追加方法

データは[data/companies.csv](./data/companies.csv)で管理されています。
PRを作成して追加してください。

項目（CSV列）

- 会社名: 会社の正式名称。
  - 登記簿の名前が優先されます。
  - 括弧書き(アルファベットとカタカナなどの併記)は基本的にしない。
- 会社URL: 会社のコーポレートサイトのURL。
  - サービスサイトではなく会社としてのトップページが優先されます。
- 紹介URL: スライドのURL。
  - 複数ある場合は改行区切りで入力します（CSVではダブルクォートで囲む）。

追加したデータは、[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/deed.ja)のライセンスの元に提供されます。
訂正、削除したい場合は、PRを作成するか、[Issue](https://github.com/azu/company-introduction-jp/issues)を作成して知らせてください。

**編集方針**

- 誤表記:
  - 正しいものへと修正する
- リンク切れ:
  - URLを変更 or 新しいものがない場合は行を削除
- 項目のフォーマットミス:
  - 項目のフォーマットに合わせて修正 or 修正できない場合は行を削除
  - 例) URLが改行区切りになっていないのを改行区切りに修正する
- 追加する場所:
  - 既に項目があるならそのまま更新する
  - ない場合は末尾へ追加する

## ウェブサイトの更新の流れ

<https://company-introduction-jp.vercel.app/>は[data/companies.csv](./data/companies.csv)を元に、手動でデータ更新workflowを実行したときに更新されます。

1. CSVが更新される（PRまたは直接編集）
2. [update-data.yml](./.github/workflows/update-data.yml)を手動で起動する
3. CSVからデータを読み取り、[pages/company.json](./pages/company.json)を更新する
4. [pages/company.json](./pages/company.json)が更新されたらVercelにデプロイされる
5. クロールエラーが発生した場合、GitHub Issueが自動作成されCopilotが修正PRを作成する

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/azu/company-introduction-jp/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- azu: [GitHub](https://github.com/azu), [Twitter](https://twitter.com/azu_re)

## License

- ソースコード: MIT © azu
- [data/companies.csv](./data/companies.csv)のデータ: [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/deed.ja)
