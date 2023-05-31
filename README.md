# Print Label A7 Size Giao Hang Tiet Kiem

Rearrange the sections in the print label of Giao Hàng Tiết Kiệm.

## Table of Contents

- [Features](#features)
- [Installation 🔥](#installation-)
- [Usage 🐕](#usage-)
- [Contributing 🔨](#contributing-)
- [Thanks for using our services](#thanks-for-using-our-services)
- [License](#license)

## Features

Rearrange the sections in the print label from free size to A7 size.

**Before**

![Before](https://github.com/namhong1412/print-label-a7-size-ghtk/assets/19573386/30796657-98f3-4eab-a64a-11ef45297acf)

**After**

![After](https://github.com/namhong1412/print-label-a7-size-ghtk/assets/19573386/506b7884-b4fb-4493-ace5-3692cee78e98)

**You can cusomize the logo on the print label**

You just add param **logo=link_logo** in the params on the URL

```text
http://localhost:3000/?logo=https://i.imgur.com/9QX3X5X.png&hash=ey....
```

![Cusomize Logo](https://github.com/namhong1412/print-label-a7-size-ghtk/assets/19573386/ce529688-8491-4cfe-8b9c-9e32a048b27c)

## Installation 🔥

- Step 1: Clone the repository:

  ```bash
  git clone https://github.com/namhong1412/print-label-a7-size-ghtk
  ```

- Step 2: Navigate to the project directory

  ```bash
  cd print-label-a7-size-ghtk
  ```

- Step 3: Install the project dependencies using npm

  ```bash
  npm install
  ```

## Usage 🐕

To start the project, use the following command:

  ```bash
  npm start
  ```

This will run the project and you should see the output in the console or a web server running
at http://localhost:3000 (or another specified port).

## Usage on Giao Hàng Tiết Kiệm

***_Notes:_ Before using this feature, You must log in to Giao Hàng Tiết Kiệm.***

- Step 1: Login to [Giao Hàng Tiết Kiệm](https://khachhang.giaohangtietkiem.vn/)

- Step 2:
  Install [Requestly](https://chrome.google.com/webstore/detail/requestly-redirect-url-mo/mdnleldcmiljblolnjhpnblkcekpdkpa)
  extension on Chrome.
  Using file [requestly_rules.json](..%2Frequestly_rules.json) to import
  on [Requestly](https://app.requestly.io/rules/my-rules).

  ```json
  [
    {
      "createdBy": "BbW6T55UJMSZlsriKYMv91KrKJ02",
      "creationDate": 1674877521855,
      "currentOwner": "BbW6T55UJMSZlsriKYMv91KrKJ02",
      "description": "",
      "groupId": "",
      "id": "Redirect_8fpja",
      "isSample": false,
      "lastModifiedBy": "BbW6T55UJMSZlsriKYMv91KrKJ02",
      "modificationDate": 1680711282934,
      "name": "GHTK App Redirect",
      "objectType": "rule",
      "pairs": [
        {
          "destination": "http://localhost:3000/custom_print.js",
          "id": "6ospn",
          "source": {
            "key": "Url",
            "operator": "Matches",
            "value": "/https://khachhang.giaohangtietkiem.vn/web/js/app.(.*).js$/i"
          }
        }
      ],
      "preserveCookie": false,
      "ruleType": "Redirect",
      "status": "Active"
    }
  ]
  
  ```
  
- Step 3: Open [Giao Hàng Tiết Kiệm](https://khachhang.giaohangtietkiem.vn/) and print label.

## Contributing 🔨

While this product has imperfections, I eagerly anticipate contributions from other skilled individuals in the developer
community.

We welcome pull requests. However, if you plan on making significant changes, please initiate an issue to discuss your
proposed modifications first.

It is essential to ensure that tests are updated as needed.

## Thanks for using our services

## License

[MIT License](https://choosealicense.com/licenses/mit/)
