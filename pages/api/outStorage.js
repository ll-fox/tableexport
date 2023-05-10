const AV = require('leancloud-storage')

const addOutStorage = async (val) => {
  const { projectId, price, weight } = val
  const OutStorage = AV.Object.extend('OutStorage')
  const Project = AV.Object.createWithoutData('Project', projectId)
  const Out = new OutStorage()
  try {
    Out.set(val)
    Project.increment('sale', Number(price))
    Project.increment('weight', Number(-weight))
    await Project.save()
    const res = await Out.save()
    return res.toJSON()
  } catch (e) {
    console.log(e)
  }
}

const updateOutStorage = async (val, id) => {
  const { projectId, price: newPrice, weight: newWeight } = val
  console.log(33111, projectId)
  const Project = AV.Object.createWithoutData('Project', projectId)
  const OutStorage = AV.Object.createWithoutData('OutStorage', id)
  const query = new AV.Query('OutStorage')
  try {
    query.get(id).then(Out=>{
      const { price, weight } = Out.toJSON()
      Project.increment('sale', Number(newPrice - price))
      Project.increment('weight', Number(weight - newWeight))
    })
    await Project.save()
    OutStorage.set(val)
    const res = await OutStorage.save()
    return res.toJSON()
  } catch (e) {
    console.log(e)
  }
}

const fetchOutStorage = async (val, selectProject) => {
  const OutStorage = new AV.Query('OutStorage')
  try {
    OutStorage.equalTo('projectId', selectProject)
    if (val) {
      OutStorage.equalTo('supplierName', val)
    }
    const data = await OutStorage.find()
    const records = data.reverse().map((x) => {
      const json = x.toJSON()
      return json
    })
    return records
  } catch (e) {
    console.log(e)
  }
}

export {
  fetchOutStorage,
  updateOutStorage,
  addOutStorage,
}
