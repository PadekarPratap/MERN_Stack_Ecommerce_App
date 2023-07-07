import jwt from 'jsonwebtoken'

export const generateToken = (res, id) =>{

    const token = jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '2d'})

    res.cookie('codeShopToken' , token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite:  process.env.NODE_ENV === 'development' ? 'lax' : 'none',
        expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    })

}