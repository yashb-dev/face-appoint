exports.checkAlerts = (event, callback) => {
  const Firestore = require("@google-cloud/firestore");
  const nodemailer = require("nodemailer");
  const settings = { timestampsInSnapshots: true };
  const firestore = new Firestore();
  firestore.settings(settings);
  var appointment_collection = firestore.collection("appointments");
  var time_doc = firestore.collection("current-time").doc("time");

  function sendMail(to, message, id) {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "face.appoint@gmail.com",
        pass: "3125897460"
      }
    });

    var mailOptions = {
      from: "face-appoint@gmail.com",
      to: to,
      subject: "Your appointment is soon. ID:" + id,
      text: message
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function checkAppointments() {
    sleep(300000).then(() => {
      console.log("successfully slept");
      var now = new Date();
      var range_begin = new Date(now.getTime() + 60000 * 25);
      var range_end = new Date(now.getTime() + 60000 * 30);
      appointment_collection
        .get()
        .then(snapshot => {
          snapshot.forEach(appointment => {
            var apt_start = appointment.data().start_time.toDate();
            if (apt_start >= range_begin && apt_start <= range_end) {
              var message =
                "This is just a friendly reminder that your appointment with " +
                appointment.data().service_provider +
                " regarding " +
                appointment.data().name +
                " is starting soon at " +
                appointment
                  .data()
                  .start_time.toDate()
                  .toTimeString()
                  .substr(0, 5) +
                ".";
              for (var email in appointment.data().emails) {
                sendMail(
                  appointment.data().emails[email],
                  message,
                  appointment.data().id
                );
              }
            }
          });
        })
        .then(() => {
          time_doc
            .set({
              time: now
            })
            .then(() => {
              callback();
            });
        });
    });
  }
  checkAppointments();
};
