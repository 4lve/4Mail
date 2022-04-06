module.exports.newAccount = async (mailUsername, password, mailjs) => {
    const newAccount = await mailjs.register(mailUsername, password)

    if(!newAccount.status) {
        let errMsg = JSON.parse(newAccount.data).violations[0].message
        //more readable error message
        if(errMsg === 'This value is already used.') errMsg = 'This username is already used.'
        return errMsg
    }

    const loginSession = await mailjs.login(mailUsername.toLowerCase(), password)
    if(!loginSession.status) {
        return `Could Not Login`
    }
    return true
}

module.exports.login = async (mailUsername, password, mailjs) => {
    const loginSession = await mailjs.login(mailUsername.toLowerCase(), password)
    if(!loginSession.status) {
        return `Could Not Login`
    }
    return true
}