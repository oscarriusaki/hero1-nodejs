const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function googleVerify( token = '') {

  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
  });
  const { name, picture, email } = ticket.getPayload();

  return {
    nombre: name, 
    img: picture, 
    correo: email,
  }
  
}

module.exports = {
    googleVerify
}
