const { can } = require('../helpers/can');

function get (req, res) {
    let path = `${__dirname}/../../views/project/calendar`;
    can(req.user.email, req.params.id, (data) => {
        if(data.error) debug(data.error, () => res.redirect('/'));
        else if(!data.project) res.redirect('/')
        else if(!data.user) res.redirect('/')
        else {
            let { project, user, member, role } = data;
            let tasks = project.tasks.map(self => self.tasks);
            let d = new Date();

            let month = d.getMonth();
            let date = d.getDate();
            let year = d.getFullYear();
            let days = new Date(year, month, 0).getDate();

            let weeks = parseInt(days/7);

            let general = [];
            let iter = 0;

            let firstDay = new Date(year + "-" + month + "-01").getDay();
            for(let i = 0; i < firstDay; i++) {
                if(general[iter] == undefined) general[iter] = [];
                general[iter].push({blank: true});
            }

            for(let i = 1; i < days; i++) {

                if(general[iter] == undefined) general[iter] = [];
                general[iter].push({date: i, tasks: tasks.filter(due => due), passed: (i<date), today: (i==date)});
                if(i%7 == 0) iter++;
                if(i+1 == days) {
                    let calendar = {
                        month, date, year, days, weeks,
                        general
                    }
        
                    res.render(path, { project, user, member, role, calendar })
                }
            }
        }
    })
}

module.exports.mod = app => {
    app.get('/project/:id/5', require('../ensureAuth'), get);
}