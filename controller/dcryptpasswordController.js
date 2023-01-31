const CryptoJS = require('crypto-js')

// DECRYPT PASSWORD
const dcryptPassword = async (req, res) => {
  const { password } = req.body

  if (!password) {
    return res.status(400).json({ error: 'បញ្ជូលពាក្យសម្ងាត់!' })
  }

  // password dcryption with crypto-js
  const decrypted = CryptoJS.AES.decrypt(password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8)

  res.status(200).json(decrypted)
}

module.exports = {
  dcryptPassword
}