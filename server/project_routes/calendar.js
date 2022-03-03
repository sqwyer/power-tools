const { can } = require('../helpers/can');
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function formatNum(x) {
    let last = x % 10;
    if(x < 10 || x > 20) {
        if(last == 1) return `${x}st`;
        else if(last == 2) return `${x}nd`;
        else if(last == 3) return `${x}rd`;
        else return `${x}th`;
    } else return `${x}th`;
}

function get (req, res) {
    let path = `${__dirname}/../../views/project/calendar`;
    can(req.user.email, req.params.id, (data) => {
        if(data.error) debug(data.error, () => res.redirect('/'));
        else if(!data.project) res.redirect('/')
        else if(!data.user) res.redirect('/')
        else {
            let { project, user, member, role } = data;
            let tasks = [];
            for(let i = 0; i < project.tasks.length; i++) {
                project.tasks[i].tasks.map(self=>self.parent=project.tasks[i].id);
                tasks.push(...project.tasks[i].tasks);
            }
            let d = new Date();
            let offset = 0;

            if(req.query.offset != undefined && Number(req.query.offset) != NaN) offset = Number(req.query.offset)

            d.setMonth(d.getMonth()+offset);

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
                if(offset != 0 && offset < 0) general[iter].push({date: i-firstDay, fDate: formatNum(i-firstDay), tasks: tasks.filter(self => self.due === `${month}/${i-firstDay}/${year}`), passed: true, today: false});
                else if(offset != 0 && offset > 0) general[iter].push({date: i-firstDay, fDate: formatNum(i-firstDay), tasks: tasks.filter(self => self.due === `${month}/${i-firstDay}/${year}`), passed: false, today: false});
                else general[iter].push({date: i-firstDay, fDate: formatNum(i-firstDay), tasks: tasks.filter(self => self.due === `${month}/${i-firstDay}/${year}`), passed: i-firstDay<date, today: i-firstDay==date});
                if(i%7 == 0) iter++;
            }

            if(general[iter] != undefined && general[iter].length != 7) {
                let l = 7-general[iter].length;
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
    });
}

function getSpecificDate(req, res) {
    can(req.user.email, req.params.id, data => {
        if(data.error) debug(res.error, () => res.redirect('/'));
        else {
            let { project, user, member, role } = data;
            let { m, d, y } = req.query;
            if(!m || !d || !y)  res.redirect('/project/' + req.params.id + '/5');
            else {
                let resTasks = [];
                let tasks = [];
                for(let i = 0; i < project.tasks.length; i++) {
                    project.tasks[i].tasks.map(self=>self.parent=project.tasks[i].id);
                    tasks.push(...project.tasks[i].tasks);
                }
                resTasks = tasks.filter(self => self.due === `${m}/${d}/${y}`) || [];
                res.render(`${__dirname}/../../views/project/calendar_spec`, {
                    tasks: resTasks,
                    project,
                    user,
                    member,
                    role,
                    m,
                    d,
                    y
                });
            }
        }
    })
}

module.exports.mod = app => {
    app.get('/project/:id/5', require('../ensureAuth'), get);
    app.get('/project/:id/5/spec', require('../ensureAuth'), getSpecificDate)
}

module.exports.formatNum = formatNum;