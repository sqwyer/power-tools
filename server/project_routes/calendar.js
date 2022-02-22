const { can } = require('../helpers/can');
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

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

            if(req.query.offset != undefined && Number(req.query.offset) != NaN) d.setMonth(d.getMonth()+Number(req.query.offset));

            let month = d.getMonth();
            let monthName = months[month];
            month++;
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

            for(let i = firstDay+1; i < days+firstDay+1; i++) {

                if(general[iter] == undefined) general[iter] = [];
                general[iter].push({date: i-firstDay, tasks: tasks.filter(due => due), passed: (i-firstDay<date), today: (i-firstDay==date)});
                if(i%7 == 0) iter++;
                if(i-firstDay == days) {
                    if(general[iter] != undefined && general[iter].length != 7) {
                        let l = 7-general[iter].length;
                        console.log(l);
                        for(let k = 0; k < l; k++) {
                            general[iter].push({blank: true});
                        }
                    }

                    let calendar = {
                        month,
                        date,
                        year,
                        days,
                        weeks,
                        general,
                        monthName,
                        offset: (req.query.offset && Number(req.query.offset) != NaN) ? Number(req.query.offset) : 0
                    }
        
                    res.render(path, { project, user, member, role, calendar })
                }
            }
        }
    });
}

module.exports.mod = app => {
    app.get('/project/:id/5', require('../ensureAuth'), get);
}