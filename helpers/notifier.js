

const onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
}

class notifier {
    constructor() {
        this.sgMail = require('@sendgrid/mail');
        this.sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        this.twilioClient = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    }

    sendMail({ to, subject, body }) {
        if (!to) {
            return;
        }
        if (!subject) {
            subject = 'Notificare';
        }
        const msg = {
            to,
            from: process.env.MAIL_FROM,
            subject,
            html: body,
        };
        this.sgMail.send(msg).catch((error) => {
            console.log('Error sending mail: ' + error.message);
        });

    }

    call(number) {
        this.twilioClient.calls
            .create({
                url: 'http://twimlets.com/holdmusic?Bucket=com.twilio.music.ambient',
                to: number,
                from: process.env.TWILIO_NUMBER
            })
            .then(call => console.log(`Call made ${call.sid}`));
    }

    static generate(errors) {
        const files = {};
        errors.forEach(e => {
            if (!(e['file'] in files)) {
                files[e['file']] = {};
            }
            if (!(e['line'] in files[e['file']])) {
                files[e['file']][e['line']] = [];
            }
            files[e['file']][e['line']].push(e['hour']);
        })

        let mail = '<div style="font-size: 24px">Au aparut diferente.</div>' +
            '<div style="font-size: 18px">Mai multe detalii aici: <a href="http://brp.popescu.xyz"><b>http://brp.popescu.xyz</b></a></div>' +
            '<div style="font-size: 14px">Pentru a functiona corect, folositi Google Chrome</div>';
        Object.keys(files).forEach(name => {
            mail += `<br/><b>${name}</b><br/>` +
                '<ul>';
            Object.keys(files[name]).forEach(comp => {
                const hours = files[name][comp].filter(onlyUnique).map(h => h + 1);
                mail += `<li><b>${comp}</b> (`;
                if (hours.length == 24) {
                    mail += 'toata ziua';
                } else {
                    mail += (hours.length > 1 ? 'orele ' : 'ora ');
                    mail += hours.join(', ');
                }
                mail += ')</li>';
            })
            mail += '</ul>';
        })

        return mail;
    }
}

module.exports = notifier
