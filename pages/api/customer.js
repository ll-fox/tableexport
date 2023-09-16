const AV = require('leancloud-storage')

const fetchCollectInfo = async () => {
  const CollectInfo = new AV.Query('CollectInfo')
  try {
    const data = await CollectInfo.find()
    const records = data.reverse().map((x) => {
      const json = x.toJSON()
      return json
    })
    return records
  } catch (e) {
    console.log(e)
  }
}

const fetchCollectUserInfo = async () => {
  const CollectInfo = new AV.Query('CollectUserInfo')
  try {
    const data = await CollectInfo.find()
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

export { updateExpressage, fetchCollectInfo, fetchCollectUserInfo }
