const { verify, decode } = require('jsonwebtoken')

module.exports = {
    checkToken: (req,res,next) => {
        let token = req.headers['authorization']
        if(token){
            token = token.slice(7)
            verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded) => {
                if(err){
                    res.sendStatus(403) //invalid token forbiiden to access
                }else{
                    next()
                }
            })
        }else{
            res.sendStatus(401)
        }
    }
}