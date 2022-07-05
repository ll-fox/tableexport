import { TABLE_HEADER } from '../../public/static/constant'
import moment from 'moment'
import { find } from 'loadsh'
import { fetchProduct } from './product'
import { fetchExpressage } from './expressage'
import { message } from 'antd'
const AV = require('leancloud-storage')

const pushItem = async (val) => {
  const count = await fetchCount()
  const Product = await fetchProduct()
  const Expressage = await fetchExpressage()
  const objects = (val || []).map((item, index) => {
    const abject = {}
    const ORDER = new AV.Object('ORDER')
    let unitPrice = 0 //单价
    let expressagePrice = 0 //快递加价费用
    Object.keys(item).forEach((element) => {
      if (item[element]) {
        abject[TABLE_HEADER[element]] = item[element]
      }
      const platformItem = find(Product, {
        platform: item['对接平台名称'],
        spece: item['规格名称']
      })
      if (platformItem) {
        const price = platformItem.price
        const expressageInfo = find(Expressage, {
          expressage: item['快递公司']
        })
        price.forEach((element) => {
          if (
            moment(String(item['日期'])).diff(
              moment(element.date[0]),
              'days'
            ) >= 0 &&
            moment(element.date[1]).diff(
              moment(String(item['日期'])),
              'days'
            ) >= 0
          ) {
            unitPrice = element.price
          }
        })
        if (expressageInfo) {
          expressageInfo.raisePriceArea.forEach((element) => {
            element.area.forEach((area) => {
              if (item['收件人地址'].includes(area)) {
                expressagePrice = element.price
              }
            })
          })
        } else {
          message.error(
            '匹配快递名称失败，请在快递列表中检查是否存在表格中的所有快递！'
          )
          return
        }
      } else {
        message.error(
          '匹配平台名称或规格名称失败，请在商品列表中检查是否存在表格中的所有平台规格！'
        )
        return
      }
      const afterPrice = item['售后金额'] ? item['售后金额'] : 0
      //总金额
      abject.amount =
        (unitPrice + expressagePrice) * Number(item['数量']) -
        Number(afterPrice)
      abject.JWNYPurchaseOrder = `JWNY${moment().format('yyyyMMDD')}${
        count + index
      }`
    })
    return ORDER.set(abject)
  })
  return AV.Object.saveAll(objects)
}

const updateItem = async (val, id) => {
  const ORDER = AV.Object.createWithoutData('ORDER', id)
  try {
    ORDER.set(val)
    const res = await ORDER.save()
    return res.toJSON()
  } catch (e) {
    console.log(e)
  }
}

const fetchTable = async (val) => {
  const ORDER = new AV.Query('ORDER')
  try {
    ORDER.limit(1000)
    ORDER.equalTo('date', Number(val))
    const data = await ORDER.find()
    const records = data.reverse().map((x) => {
      const json = x.toJSON()
      return json
    })
    return records
  } catch (e) {
    console.log(e)
  }
}

const fetchCount = async () => {
  const ORDER = new AV.Query('ORDER')
  try {
    return ORDER.count()
  } catch (e) {
    console.log(e)
  }
}

export { pushItem, fetchTable, updateItem }
