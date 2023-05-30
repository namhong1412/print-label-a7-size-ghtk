import express from "express"
import { load } from "cheerio"
import axios from "axios"

const app = express()
const port = 3000

const OPTION_CUSTOM_LOGO = {
  replace: 1,
  sunken: 2,
}
const GHTK_API_URL = "https://web.giaohangtietkiem.vn/api/v2/print-label"
const GHTK_ORIGIN = "https://khachhang.giaohangtietkiem.vn"
const CUSTOMER_PRINT_CSS = "/style.css?v=18"
const GHTK_FAVICON = "/ghtk_favicon.png"
let GHTK_LOGO = "/ghtk_logo.png"
let CUSTOM_LOGO = ""

app.get("/", async (req, res) => {
  try {
    const { hash, logo, option = OPTION_CUSTOM_LOGO.replace } = req.query
    if (!hash) return res.redirect("https://fb.com/namhong1412")

    const decodedData = Buffer.from(hash, "base64").toString("ascii")
    const data = JSON.parse(decodedData)
    const { token, id: dataPackage } = data

    const paramDataPackage = dataPackage
      .map((item) => `data[package_id][${item}]=1`)
      .join("&")

    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${GHTK_API_URL}?${paramDataPackage}`,
      headers: {
        authority: "web.giaohangtietkiem.vn",
        accept: "*/*",
        "accept-language":
          "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7,fr-FR;q=0.6,fr;q=0.5",
        authorization: `Bearer ${token}`,
        "cache-control": "no-cache",
        dnt: "1",
        origin: GHTK_ORIGIN,
        pragma: "no-cache",
        referer: GHTK_ORIGIN,
        "sec-ch-ua":
          '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
      },
    }

    const htmlRaw = await axios(config)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
    const result = await restructureDeliveryNote({
      html: htmlRaw,
      logo,
      option,
    })

    res.setHeader("Content-Type", "text/html")
    return res.send(result)
  } catch (error) {
    console.log(error)
    return res.redirect("https://fb.com/namhong1412")
  }
})

const restructureDeliveryNote = async ({ html, logo, option = 1 }) => {
  const $ = load(html)

  $("style:not([media])").remove()
  $("div.aui-group.label-row:contains('http://kh.ghtk.vn')").remove()
  $(
    "div.aui-item.barcode:contains('iGHTK') div[style='font-size: 12px;']"
  ).remove()

  // Change font size of Order Code
  $("h1[style*=font-size]").css("font-size", "16px")

  // Remove all css style in div.sheet
  $("div.sheet").attr("style", "position: relative;")

  // Barcode number
  $("span[style*=text-align][style*=font-size][style*=padding-top]").css(
    "padding-top",
    ""
  )

  // Modify styles of div.aui-group
  $("div.aui-group").each((i, el) => {
    const $el = $(el)
    const style = $el.attr("style")
    if (!style) return
    let newStyle = style
      .replace("width: 35%", "width: 25%")
      .replace("border-right: 1px solid #333; ", "")
    const padding = style.match(/padding: 10px/)
    const borderBottom = style.match(/border-bottom: none/)
    const borderRight = style.match(/border-right: 1px solid #333/)
    const verticalAlign = style.match(/vertical-align: middle/)
    const width = style.match(/width: 35%/)
    if (padding && borderBottom) {
      newStyle =
        "border-bottom: none;padding: 5px;font-size: 12px;display: flex;align-items: center;justify-content: space-between;margin: 0;"
    } else if (borderRight && verticalAlign && width) {
      newStyle = newStyle.replace("width: 35%", "width: 25%")
    }
    $el.attr("style", newStyle)
  })

  $(
    "div.aui-item[style*=border-right][style*=vertical-align][style*=width]"
  ).each((i, el) => {
    const $el = $(el)
    $el.attr(
      "style",
      $el
        .attr("style")
        .replace("width: 35%", "width: 25%")
        .replace("border-right: 1px solid #333; ", "")
    )
  })

  // Modify styles of Phiếu giao hàng
  $(
    "div:contains('Phiếu giao hàng')[style*=text-transform][style*=font-size]"
  ).css("font-size", "20px")

  $("div.aui-item.barcode").each((i, el) => {
    const $el = $(el)
    const $stations = $el.next("div.aui-item.stations")
    const $codeOrder = $el.prev()
    const $qrCode = $stations.next("div.aui-item.qrcode")
    if ($stations.length > 0 && $qrCode && $codeOrder.length > 0) {
      $qrCode.appendTo($el)
      $codeOrder.prependTo($el)

      const $table = $stations.find("table")
      const styleStations = $stations.attr("style")

      if (!styleStations) return
      $stations.attr(
        "style",
        styleStations.replace("border-right", "border-top")
      )

      $table.attr("style", "")
      $qrCode.attr("style", "border-right: 0;padding: 0;text-align: center;")
    }
    const styleBarcode = $el.attr("style")
    if (!styleBarcode) return
    $el.attr(
      "style",
      styleBarcode.replace("border-right: 1px solid #333; ", "")
    )
  })

  $(
    'img[src="https://s.giaohangtietkiem.vn/customer/img/transport-truck-icon.png"]'
  ).attr("style", "height: 30px;width: auto !important;margin-right: 15px;")

  $("div.aui-group.label-row").each((i, el) => {
    const $el = $(el)
    let style = $el.attr("style")
    if (!style) return
    const minHeight = style.match(/min-height: 80px;/)
    $el.attr("style", style.replace("min-height: 80px;", "min-height: auto;"))
    if (minHeight) {
      const $customerOrderCode = $el.find("div.aui-item")
      const styleCustomerOrderCode = $customerOrderCode.attr("style")
      if (!styleCustomerOrderCode) return
      $customerOrderCode.attr(
        "style",
        "width: 100%;padding-left: 30px;display: flex;justify-content: space-around;align-items: center;margin-top: 10px;"
      )
    }
  })

  $("div.aui-group.label-row.product-info").each((i, el) => {
    const $el = $(el)
    const $productInfo = $el.find("div.aui-item[style='padding-left: 0']")
    $productInfo.appendTo($el.parent())
    const styleProductInfo = $productInfo.attr("style")
    if (!styleProductInfo) return
    $productInfo.attr("style", "padding-left: 0;border-top: 1px solid #333;")
  })

  $("div.aui-item.aui-border-r.pdl-0:contains('Sản phẩm')")
    .filter("[style*='width: 90%']")
    .attr("style", "width: 500px; border-right: 1px solid #333;")

  $("div.aui-item.aui-border-r.pdl-0:contains('SL')").attr(
    "style",
    "width: 86px"
  )

  $("div.aui-item.aui-border-r[style='width: 90%; padding-left: 10px']").attr(
    "style",
    "width: 500px; border-right: 1px solid #333;text-align: center;"
  )

  $("div.aui-item.aui-border-r.pdl-0[style='text-align: center']").attr(
    "style",
    "text-align: center;width: 86px;"
  )

  $("div[style='padding: 10px 10px 10px 30px; font-size: 12px;']")
    .filter("[style*='font-size: 12px']")
    .attr("style", "padding: 10px 10px 10px 30px; font-size: 14px;")

  $("div.aui-item.label-cell[style='width: 27%; padding: 0 10px;']").each(
    (i, el) => {
      const $el = $(el)
      const $labelNote = $el.find("div.label-note")
      const $labelNoteChild = $el.find(
        "div[style='font-weight: bold; margin-top: 8px;']"
      )
      $labelNoteChild.attr("style", "font-weight: bold; margin-bottom: 5px;")
      $labelNoteChild.prependTo($labelNote)
    }
  )

  $("link").each((i, el) => {
    const $el = $(el)
    $el.attr("href", CUSTOMER_PRINT_CSS)
  })

  $("div[style='display: block; page-break-after: always;']").remove()

  $(
    "div[style='font-weight: bold;padding: 0 0 10px 0; text-align: center; text-decoration: underline;']"
  ).attr(
    "style",
    "font-weight: bold;padding: 0 0 10px 0; text-align: center; text-decoration: none;"
  )

  if (logo && option == OPTION_CUSTOM_LOGO.replace) {
    $(
      "img[src='https://s.giaohangtietkiem.vn/customer/img/ghtk_logo.png']"
    ).attr("src", logo)
  } else {
    $(
      "img[src='https://s.giaohangtietkiem.vn/customer/img/ghtk_logo.png']"
    ).attr("src", GHTK_LOGO)
  }

  $("head").append(
    `
    <title>Phiếu giao hàng khổ A7</title>
    <link rel="shortcut icon" href="${GHTK_FAVICON}" type="image/x-icon">
    `
  )

  if (logo && option == OPTION_CUSTOM_LOGO.sunken) {
    $("div.sheet").prepend(
      `
      <img class="sunken-custom-logo" src="${CUSTOM_LOGO}">
      `
    )
  }

  return $.html()
}

app.use(express.static("public"))

app.listen(port, () =>
  console.log(`App listening on port http://localhost:${port}`)
)
