const AV = require('leancloud-storage')

const addPackage = async (val) => {
  const Package = AV.Object.extend('Package')
  const PackageQuery = new AV.Query('Package')
  const pack = new Package()
  try {
    PackageQuery.equalTo('packageName', val.packageName)
    const count = await PackageQuery.count()
    if (count) {
      return false
    } 
    pack.set(val)
    const res = await pack.save()
    return res.toJSON()
  } catch (e) {
    console.log(e)
  }
}

const fetchPackage = async (selectProject) => {
  const Package = new AV.Query('Package')
  try {
    Package.equalTo('projectId', selectProject)
    const data = await Package.find()
    const records = data.reverse().map((x) => {
      const json = x.toJSON()
      return json
    })
    return records
  } catch (e) {
    console.log(e)
  }
}

const updatePackage = async (val, id) => {
  const Package = AV.Object.createWithoutData('Package', id)
  const PackageQuery = new AV.Query('Package')
  try {
    PackageQuery.equalTo('packageName', val.packageName)
    const count = await PackageQuery.count()
    if (count>1) {
      return false
    } 
    Package.set(val)
    const res = await Package.save()
    return res.toJSON()
  } catch (e) {
    console.log(e)
  }
}

export { updatePackage, addPackage, fetchPackage }
