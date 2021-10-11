# company-introduction-jp

日本の会社紹介スライドのまとめ。

## ウェブサイト

次のURLから、会社ごとのスライドの一覧を確認できます。

- <https://company-introduction-jp.vercel.app/>

## 会社紹介スライドの追加方法

データはGoogle SpreadSheetで管理されています。
次のSpreadSheetに自由に追加してください。

- <https://docs.google.com/spreadsheets/d/1y1pqQhBIV_uGCp-AzxSQwLDOV4v_tIPobnQJmFMJVDc/edit>

項目

- 会社名: 会社の正式名称。
  - 登記簿の名前が優先されます。
- 会社URL: 会社のコーポレートサイトのURL。
  - サービスサイトではなく会社としてのトップページが優先されます。
- 紹介URL: スライドのURL。
  - 複数ある場合は改行区切りで入力します。
  
## ウェブサイトの更新の流れ

<https://company-introduction-jp.vercel.app/>は[SpreadSheet](https://docs.google.com/spreadsheets/d/1y1pqQhBIV_uGCp-AzxSQwLDOV4v_tIPobnQJmFMJVDc)を元に1日1回更新されます。

1. SpreadSheetが更新される
2. [update-data.yml](./.github/workflows/update-data.yml)が1日1回が起動する
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

MIT © azu
