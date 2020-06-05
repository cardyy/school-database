

      setTimeout(async function () {
        let attendanceArray;
        attendanceArray = await outlets.findById(redID);
        attendanceArray.teachers.find(
          ({ email }) => email === username
        ).session = attendanceArray.teachers.find(
          ({ email }) => email === username
        ).session = 1;
        try {
          await attendanceArray.save(function (err, data) {
            if (err) throw err;
          });
          console.log("Session logged");
        } catch {
          console.log("Could not log user");
        }
      }, 1);
      
      
      <%=data.name%>
      <%= popup %>