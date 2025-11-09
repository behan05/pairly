
function generateOTP() {
    // generate otp
    // 5 min expiry
    // 6-digit
    return {
        otp: Math.floor(100000 + Math.random() * 900000),
        otpExpires: new Date(Date.now() + 5 * 60 * 1000)
    }
}

module.exports = generateOTP;