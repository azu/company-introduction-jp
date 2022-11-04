g# company-introduction-jp

日本の会社紹介スライドのまとめ。

## ウェブサイト

次のURLから、会社ごとのスライドの一覧を確認できます。

- <https://company-introduction-jp.vercel.app/>

### API

会社の一覧をJSONで返します。

- <https://company-introduction-jp.vercel.app/api/company>

## 会社紹介スライドの追加方法

データはGoogle SpreadSheetで管理されています。
次のSpreadSheetに対して自由に追加してください。

- <https://docs.google.com/spreadsheets/d/1y1pqQhBIV_uGCp-AzxSQwLDOV4v_tIPobnQJmFMJVDc/edit>

項目

- 会社名: 会社の正式名称。
  - 登記簿の名前が優先されます。
  - 括弧書き(アルファベットとカタカナなどの併記)は基本的にしない。
- 会社URL: 会社のコーポレートサイトのURL。
  - サービスサイトではなく会社としてのトップページが優先されます。
- 紹介URL: スライドのURL。
  - 複数ある場合は改行区切りで入力します。

追加したデータは、[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/deed.ja)のライセンスの元に提供されます。
訂正、削除したい場合は、SpreadSheetを編集してください。
または、[Issue](https://github.com/azu/company-introduction-jp/issues)を作成して知らせてください。

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

<https://company-introduction-jp.vercel.app/>は[SpreadSheet](https://docs.google.com/spreadsheets/d/1y1pqQhBIV_uGCp-AzxSQwLDOV4v_tIPobnQJmFMJVDc)を元に1日1回更新されます。

1. SpreadSheetが更新される
2. [update-data.yml](./.github/workflows/update-data.yml)が1日1回起動する
3. [Sheetson](https://sheetson.com/)を使ってSpreadSheetの中身を取得して、[pages/company.json](./pages/company.json)を更新する
4. [pages/company.json](./pages/company.json)が更新されたらVercelにデプロイされる

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
- [SpreadSheet](https://docs.google.com/spreadsheets/d/1y1pqQhBIV_uGCp-AzxSQwLDOV4v_tIPobnQJmFMJVDc)のデータ: [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/deed.ja)
