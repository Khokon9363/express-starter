function getInbox(req, res, next) {
    res.render('inbox', {
        title: 'Inbox page -  Chat Application'
    })
}

module.exports = {
    getInbox
}