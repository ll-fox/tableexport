const AV = require('leancloud-storage')

const addOutStorage = async (val) => {
  const { projectId, price, weight, amount, packageId } = val
  let Package=''
  const OutStorage = AV.Object.extend('OutStorage')
  const Project = AV.Object.createWithoutData('Project', projectId)
  if (packageId){
    Package = AV.Object.createWithoutData('Package', packageId)
  } 
  const Out = new OutStorage()
  try {
    Out.set(val)
    Project.increment('sale', Number(price))
    Project.increment('weight', Number(-weight))
    await Project.save()
    if (Package){
      Package.increment('inventory', Number(-amount))
      await Package.save()
    } 
    const res = await Out.save()
    return res.toJSON()
  } catch (e) {
    console.log(e)
  }
}

const updateOutStorage = async (val, id) => {
  const {
    projectId,
    price: newPrice,
    weight: newWeight,
    amount: newAmount,
    packageId
  } = val
  const Project = AV.Object.createWithoutData('Project', projectId)
  const OutStorage = AV.Object.createWithoutData('OutStorage', id)
  const query = new AV.Query('OutStorage')
  try {
    query.get(id).then((Out) => {
      const { price, weight, amount } = Out.toJSON()
      Project.increment('sale', Number(newPrice - price))
      Project.increment('weight', Number(weight - newWeight))
      Project.save()
      if (packageId) {
        const Package = AV.Object.createWithoutData('Package', packageId)
        Package.increment('inventory', Number(amount - newAmount))
        Package.save()
      } 
    })
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
