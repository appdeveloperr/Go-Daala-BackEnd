exports.isAdmin = function (req, res, next) {
    if (req.isAuthenticated() && req.user.username === 'Admin') {      
            next();
     
    } else {
        req.flash('danger', 'Please log in again!');
        res.redirect('/');
    }
}

exports.isEditor = function (req, res, next) {
    if (req.isAuthenticated() && req.user[0].user_category === 'Editor') {
        if (req.user[0].validation_status == 'yes') {
            next();
        } else {
            req.flash('danger', 'Please wait for admin approval');
            res.redirect('/users/login');
        }

    } else {
        req.flash('danger', 'Please log in as admin or Editor');
        res.redirect('/users/login');
    }
}