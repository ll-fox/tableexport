const AV = require('leancloud-storage')
import moment from 'moment'

const addCapital = async (val) => {
  const Capital = AV.Object.extend('Capital')
  const capital = new Capital()
  const count = await fetchCount()
  try {
    val.id = `JWNYKD${moment().format('yyyyMMDD')}${count + 1}`
    capital.set(val)
    const res = await capital.save()
    return res.toJSON()
  } catch (e) {
    console.log(e)
  }
}

const fetchCapital = async () => {
  const Capital = new AV.Query('Capital')
  try {
    const data = await Capital.find()
    const records = data.reverse().map((x) => {
      const json = x.toJSON()
      return json
    })
    return records
  } catch (e) {
    console.log(e)
  }
}

const updateCapital = async (val, id) => {
  const Capital = AV.Object.createWithoutData('Capital', id)
  try {
    Capital.set(val)
    const res = await Capital.save()
    return res.toJSON()
  } catch (e) {
    console.log(e)
  }
}
const fetchCount = async () => {
  const Capital = new AV.Query('Capital')
  try {
    return Capital.count()
  } catch (e) {
    console.log(e)
  }
}

export { updateCapital, addCapital, fetchCapital }
