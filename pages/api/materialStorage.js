const AV = require('leancloud-storage')

const addSupplier = async (params) => {
  const Supplier = AV.Object.extend('Supplier')
  const supplier = new Supplier()
  try {
    supplier.set(params)
    const res = await supplier.save()
    return res.toJSON()
  } catch (e) {
    console.log(e)
  }
}

const fetchSupplier = async (val) => {
  const Supplier = new AV.Query('Supplier')
  try {
    Supplier.equalTo('projectId', val)
    const data = await Supplier.find()
    const records = data.reverse().map((x) => {
      const json = x.toJSON()
      return json
    })
    return records
  } catch (e) {
    console.log(e)
  }
}
const addMaterialStorage = async (val) => {
  const { projectId, price, weight } = val
  const MaterialStorage = AV.Object.extend('MaterialStorage')
  const Project = AV.Object.createWithoutData('Project', projectId)
  const material = new MaterialStorage()
  try {
    material.set(val)
    Project.increment('expend', Number(price))
    Project.increment('weight', Number(weight))
    await Project.save()
    const res = await material.save()
    return res.toJSON()
  } catch (e) {
    console.log(e)
  }
}

const updateMaterialStorage = async (val, id) => {
  const { projectId, price: newPrice, weight: newWeight } = val
  const Project = AV.Object.createWithoutData('Project', projectId)
  const MaterialStorage = AV.Object.createWithoutData('MaterialStorage', id)
  const query = new AV.Query('MaterialStorage')
  try {
    query.get(id).then(material=>{
      const { price, weight } = material.toJSON()
      Project.increment('expend', Number(newPrice - price))
      Project.increment('weight', Number(newWeight - weight))
      Project.save()
    })
    MaterialStorage.set(val)
    const res = await MaterialStorage.save()
    return res.toJSON()
  } catch (e) {
    console.log(e)
  }
}

const fetchMaterialStorage = async (val, selectProject) => {
  const MaterialStorage = new AV.Query('MaterialStorage')
  try {
    MaterialStorage.equalTo('projectId', selectProject)
    if (val) {
      MaterialStorage.equalTo('supplierName', val)
    }
    const data = await MaterialStorage.find()
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
  fetchMaterialStorage,
  updateMaterialStorage,
  addMaterialStorage,
  addSupplier,
  fetchSupplier
}
