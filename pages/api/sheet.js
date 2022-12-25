const AV = require('leancloud-storage')


const fetchWarehouse = async () => {
  const Warehouse = new AV.Query('Warehouse')
  try {
    const data = await Warehouse.find()
    const records = data.reverse().map((x) => {
      const json = x.toJSON()
      return json
    })
    return records
  } catch (e) {
    console.log(e)
  }
}

const addWarehouse = async (val) => {
  const Warehouse = AV.Object.extend('Warehouse')
  const warehouse = new Warehouse()
  try {
    warehouse.set('name', val)
    const res = await warehouse.save()
    return res.toJSON()
  } catch (e) {
    console.log(e)
  }
}

const destroyWarehouse = async (val) => {
  try {
    const warehouse = AV.Object.createWithoutData('Warehouse', val.objectId)
    warehouse.destroy()
  } catch (e) {
    console.log(e)
  }
}

const fetchProductName = async () => {
  const ProductName = new AV.Query('ProductName')
  try {
    const data = await ProductName.find()
    const records = data.reverse().map((x) => {
      const json = x.toJSON()
      return json
    })
    return records
  } catch (e) {
    console.log(e)
  }
}

const addProductName = async (val) => {
  const ProductName = AV.Object.extend('ProductName')
  const productName = new ProductName()
  try {
    productName.set('name', val)
    const res = await productName.save()
    return res.toJSON()
  } catch (e) {
    console.log(e)
  }
}

const destroyProductName = async (val) => {
  try {
    const productName = AV.Object.createWithoutData('ProductName', val.objectId)
    productName.destroy()
  } catch (e) {
    console.log(e)
  }
}

const addOutTemplateInfo = async (val) => {
  const OutTemplate = AV.Object.extend('OutTemplates')
  const outTemplate = new OutTemplate()
  try {
    outTemplate.set(val)
    const res = await outTemplate.save()
    console.log(1111, res.toJSON())
    return res.toJSON()
  } catch (e) {
    console.log(e)
  }
}

const fetchOutTemplateInfo = async () => {
  const OutTemplate = new AV.Query('OutTemplates')
  try {
    const data = await OutTemplate.find()
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
  addWarehouse,
  fetchWarehouse,
  destroyWarehouse,
  fetchProductName,
  addProductName,
  destroyProductName,
  addOutTemplateInfo,
  fetchOutTemplateInfo
}