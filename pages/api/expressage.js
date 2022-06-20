const AV = require('leancloud-storage')

const addExpressage = async (val) => {
  const Expressage = AV.Object.extend('Expressage')
  const expressage = new Expressage()
  try {
    expressage.set(val)
    const res = await expressage.save()
    return res.toJSON()
  } catch (e) {
    console.log(e)
  }
}

const fetchExpressage = async () => {
  const Expressage = new AV.Query('Expressage')
  try {
    const data = await Expressage.find()
    const records = data.reverse().map((x) => {
      const json = x.toJSON()
      return json
    })
    return records
  } catch (e) {
    console.log(e)
  }
}

const updateExpressage = async (val, id) => {
  const Expressage = AV.Object.createWithoutData('Expressage', id)
  try {
    Expressage.set(val)
    const res = await Expressage.save()
    return res.toJSON()
  } catch (e) {
    console.log(e)
  }
}


export { updateExpressage, addExpressage, fetchExpressage }
