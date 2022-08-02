const AV = require('leancloud-storage')

AV.init({
  appId: 'RgJnG8EpuIlP35di6d98C8sK-MdYXbMMI',
  appKey: '5jaazvJechfzPLn2dsCcelj4',
  serverURL: 'https://jwny.xyz'
})

const signUp = async (username, password) => {
  var user = new AV.User()
  user.setUsername(username)
  user.setPassword(password)
  return user.signUp()
}

const logIn = async (username, password) => AV.User.logIn(username, password)

const currentUser = async () => AV.User.current()

const logOut = async () => AV.User.logOut()

export { signUp, logIn, currentUser, logOut }
