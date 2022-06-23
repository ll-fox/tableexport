import { TABLE_HEADER } from '../../public/static/constant'
import moment from 'moment'
import { find } from 'loadsh'
import { fetchProduct } from './product'
import { fetchExpressage } from './expressage'
const AV = require('leancloud-storage')

const pushItem = async (val) => {
  const count = await fetchCount()
  const Product = await fetchProduct()
  const Expressage = await fetchExpressage()
  const objects = (val || []).map((item, index) => {
    const abject = {}
    const ORDER = new AV.Object('ORDER')
    Object.keys(item).forEach((element) => {
      if (item[element]) {
        abject[TABLE_HEADER[element]] = item[element]
      }
      //单价
      const price =
        Number(
          find(Product, {
            platform: item['对接平台名称'],
            spece: item['规格名称']
          })?.price
        ) || 0
      const expressageInfo = find(Expressage, {
        expressage: item['快递公司']
      })
      const raisePrice = Number(expressageInfo.raisePrice) || 0
      //快递是否加价
      let isRaisePrice = false
      expressageInfo.raisePriceArea.forEach((item) => {
        if (item['收件人地址'].indexOf(item) >= 0) {
          isRaisePrice = true
        }
      })
      //总金额
      abject.amount =
        price * Number(item['数量']) +
        (isRaisePrice ? Number(raisePrice) : 0) -
        Number(item['售后金额'])
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
