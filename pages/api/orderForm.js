import { TABLE_HEADER } from '../../public/static/constant'
import moment from 'moment'
const AV = require('leancloud-storage')

AV.init({
  appId: 'RgJnG8EpuIlP35di6d98C8sK-MdYXbMMI',
  appKey: '5jaazvJechfzPLn2dsCcelj4',
  serverURL: 'https://rgjng8ep.api.lncldglobal.com'
})

const pushItem = async (val) => {
  const objects = (val || []).map((item, index) => {
    const abject = {}
    const QA = new AV.Object('ORDER')
    Object.keys(item).forEach((element) => {
      abject.JWNYPurchaseOrder = `JWNY${moment().format('yyyyMMDD')}${index}`
      if (item[element]) {
        abject[TABLE_HEADER[element]] = item[element]
      }
    })
    return QA.set(abject)
  })
  return AV.Object.saveAll(objects)
}

const updateItem = async (val, id) => {
  const QA = AV.Object.createWithoutData('ORDER', id)
  try {
    QA.set(val)
    const res = await QA.save()
    return res.toJSON()
  } catch (e) {
    console.log(e)
  }
}

const fetchTable = async () => {
  const QA = new AV.Query('ORDER')
  try {
    const data = await QA.find()
    const records = data.reverse().map((x) => {
      const json = x.toJSON()
      return json
    })
    return records
  } catch (e) {
    console.log(e)
  }
}

export { pushItem, fetchTable, updateItem }
