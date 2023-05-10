const AV = require('leancloud-storage')

const addProject = async (val) => {
  const Project = AV.Object.extend('Project')
  const project = new Project()
  try {
    project.set(val)
    const res = await project.save()
    return res.toJSON()
  } catch (e) {
    console.log(e)
  }
}

const fetchProject = async (val) => {
  const Project = new AV.Query('Project')
  try {
    val && Project.equalTo('objectId', val)
    const data = await Project.find()
    const records = data.reverse().map((x) => {
      const json = x.toJSON()
      return json
    })
    return records
  } catch (e) {
    console.log(e)
  }
}

const updateProject = async (val, id) => {
  const Project = AV.Object.createWithoutData('Project', id)
  try {
    Project.set(val)
    const res = await Project.save()
    return res.toJSON()
  } catch (e) {
    console.log(e)
  }
}

export { updateProject, addProject, fetchProject }
