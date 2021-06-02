const express = require("express");
var nodemailer = require("nodemailer");
var mysql = require("mysql");
var session = require("express-session");
const app = express();
var path = require("path");
var http = require("http").Server(app);
var io = require("socket.io")(http);
var crypto = require("crypto");
//http.listen(4600);
var process = require("process");
//const kill = require('kill-port')
var bodyParser = require("body-parser");
const documents = {};
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: "log-in" }));
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ippmcmp07@gmail.com",
    pass: "ippm#07@cmp",
  },
});
var algorithm = "aes256";
var key = "password";
function encrypt(text) {
  var cipher = crypto.createCipher(algorithm, key);
  var encrypted = cipher.update(text, "utf8", "hex") + cipher.final("hex");
  return encrypted;
}
function decrypt(text) {
  var decipher = crypto.createDecipher(algorithm, key);
  var decrypted = decipher.update(text, "hex", "utf8") + decipher.final("utf8");
  return decrypted;
}
//define sender email
//compileX
var compiler = require("compilex");
var option = { stats: true };
compiler.init(option);
//var mykey = crypto.createCipher('aes-128-cbc', 'mypassword');

//console.log(process.pid);
const posts = require("./server/routes/posts");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sampleDB",
});
//<script type="text/javascript" src="ippm/runtime.js"></script><script type="text/javascript" src="ippm/polyfills.js"></script><script type="text/javascript" src="ippm/styles.js"></script><script type="text/javascript" src="ippm/vendor.js"></script><script type="text/javascript" src="ippm/main.js"></script></body>

connection.connect(function (error) {
  if (!!error) {
    console.log("error");
  } else {
    console.log("connected");
  }
});
users = [];
io.on("connection", function (socket) {
  let previousId;
  console.log("A user connected");
  socket.on("setUsername", function (data) {
    console.log(data);

    if (users.indexOf(data) > -1) {
      socket.emit(
        "userExists",
        data + " username is taken! Try some other username."
      );
    } else {
      users.push(data);
      console.log("userset:" + data);
      socket.emit("userSet", { username: data });
    }
  });

  socket.on("forget", function (data) {
    console.log("gmail:" + data);
    connection.query(
      "select * from register where `gmail`='" + data + "'",
      function (error, rows, fields) {
        if (!!error) {
          console.log("error in the forget query:" + error);
        } else if (rows > 0) {
          console.log(rows[0].gmail);
          socket.emit("emailsend", "failed");
        } else {
          var mailOptions = {
            from: "ippmcmp07@gmail.com",
            to: data,
            subject: "IPPM Support",
            text:
              "Hi " +
              rows[0].username +
              ", Your Password is " +
              decrypt(rows[0].password),
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
          socket.emit("emailsend", "success");
        }
      }
    );
  });

  socket.on("createmember", function (data) {
    console.log("data.project:" + data.projectname);
    console.log("memebers:" + data.members);
    console.log("user:" + data.user);
    var proid = data.user + "@" + data.projectname;
    if (data.members.length == 0) {
      console.log("true");
      var sql =
        "INSERT INTO project (`username`, `projectid`, `projectname`, `count`, `size`, `paid`) VALUES ('" +
        data.user +
        "', '" +
        proid +
        "', '" +
        data.projectname +
        "', '" +
        1 +
        "', '" +
        0 +
        "', '" +
        0 +
        "')";
      connection.query(sql, function (error, rows, fields) {
        if (!!error) {
          console.log("error in the Insert query:" + error);
        } else {
          console.log("project inserted");
        }
      });
      fs.mkdir("./server_storage/" + proid, function () {
        var defaultStorage = firebase.database().ref(data.user);
        //var cfile = defaultStorage.child('file');
        defaultStorage.push(proid);
        console.log("file created");
      });
    } else {
      for (x in data.members) {
        console.log(data.members[x]);
        var tomail = data.members[x].substring(
          data.members[x].indexOf(":") + 2,
          data.members[x].length
        );
        var mailOptions = {
          from: "ippmcmp07@gmail.com",
          to: tomail,
          subject: "IPPM New Project Collaboration",
          text:
            "Hi programmer, \nIt is a invitation to collaborate in Project " +
            data.projectname +
            ".\n For collaboration, login to IPPM or signup click on choose existing \n and enter projectId.\n" +
            "ProjectId is " +
            proid,
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      }
      var sql =
        "INSERT INTO project (`username`, `projectid`, `projectname`, `count`, `size`, `paid`) VALUES ('" +
        data.user +
        "', '" +
        proid +
        "', '" +
        data.projectname +
        "', '" +
        1 +
        "', '" +
        0 +
        "', '" +
        0 +
        "')";
      connection.query(sql, function (error, rows, fields) {
        if (!!error) {
          console.log("error in the Insert query:" + error);
        } else {
          console.log("project inserted");
        }
      });
      fs.mkdir("./server_storage/" + proid, function () {
        var defaultStorage = firebase.database().ref(data.user);
        defaultStorage.push(proid);
        console.log("file created");
      });
    }
  });
  socket.on("existing_project", function (data) {
    var project_name = [];
    connection.query(
      "select * from project where `username`='" + data + "'",
      function (error, rows, fields) {
        if (!!error) {
          console.log("error in the Insert query:" + error);
        } else {
          console.log("project inserted");
        }
        for (var i; i < rows.length; i++) {
          project_name.push(rows[i].projectname);
        }
        socket.emit("prolist", project_name);
      }
    );
  });
  socket.on("tproject", function (data) {
    console.log("tpproject:" + data);
    var uname = data.projectid.substring(0, data.projectid.indexOf("@"));
    var proname = data.projectid.substring(
      data.projectid.indexOf("@") + 1,
      data.projectid.length
    );
    var sql =
      "SELECT * from project WHERE `username`='" +
      data.user +
      "' AND `projectid`='" +
      data.projectid +
      "'";
    connection.query(sql, function (error, rows, fields) {
      if (!!error) {
        console.log("error in the Insert query:" + error);
      } else {
        console.log("project inserted");
      }
      if (rows.length == 0) {
        var sql =
          "INSERT INTO project (`username`, `projectid`, `projectname`, `count`, `size`, `paid`) VALUES ('" +
          data.user +
          "', '" +
          data.projectid +
          "', '" +
          proname +
          "', '" +
          1 +
          "', '" +
          0 +
          "', '" +
          0 +
          "')";
        connection.query(sql, function (error, rows, fields) {
          if (!!error) {
            console.log("error in the Insert query:" + error);
          } else {
            console.log("project inserted");
          }
        });
      }
    });
    connection.query(
      "select * from project where `projectid`='" +
        data.projectid +
        "' AND `count`=" +
        1,
      function (error, rows, fields) {
        if (!!error) {
          console.log("error in the Insert query:" + error);
        } else {
          console.log("project inserted");
        }
        if (rows.length > 1) {
          //take from server
          fs.readdir(
            "./server_storage/" + data.projectid + "/",
            (err, files) => {
              files.forEach((file) => {
                fs.readFile(file, "utf-8", function (err, data) {
                  if (err) console.log(err);
                  documents[file] = data;
                  socket.emit("documents", Object.keys(documents));
                  socket.emit("document", { id: file, doc: data });
                });
                console.log(file);
              });
            }
          );
        } else {
          //download from
          var fnames = [];
          console.log("data.user:" + uname + ", proname:" + proname);
          var defaultStorage = firebase.database().ref(uname.toString());
          var cfile = defaultStorage.child(proname.toString());
          cfile.once("value", function (snapshot) {
            console.log("cfile");
            console.log(snapshot.val());
            snapshot.forEach(function (childSnapshot) {
              console.log(childSnapshot.key);
              console.log(childSnapshot.val());
              fnames.push(childSnapshot.val());
            });
            console.log("fname:" + fnames);
            socket.emit("link", { fname: fnames, pro: proname, uname: uname });
          });
        }
      }
    );
  });

  socket.on("msg", function (data) {
    //Send message to everyone
    console.log(data.user);
    console.log(data.message);
    io.sockets.emit("newmsg", data);
  });
  socket.on("disconnect", function () {
    console.log("user disconnected");
  });

  socket.on("signup", function (data) {
    var mystr = encrypt(data.password);
    console.log(
      "email:" + data.email + ",password:" + mystr + ",usrname:" + data.username
    );
    //var values = [data.email, mystr, data.username];
    var sql =
      "INSERT INTO register (`gmail`, `password`, `username`) VALUES ('" +
      data.email +
      "', '" +
      mystr +
      "', '" +
      data.username +
      "')";
    connection.query(sql, function (error, rows, fields) {
      if (!!error) {
        console.log("error in the Insert query:" + error);
      } else {
        console.log("inserted");
      }
    });
  });

  socket.on("login", function (data) {
    console.log("enter in login:" + data.username);
    connection.query(
      "select * from register where `username`='" + data.username + "'",
      function (error, rows, fields) {
        if (!!error) {
          console.log("error in the login query:" + error);
        } else {
          console.log("else");
          if (rows) {
            var decrypted = encrypt(data.password);
            var buf1 = Buffer.from(decrypted);
            var buf2 = Buffer.from(rows[0].password);
            if (buf1.equals(buf2)) {
              console.log("match");
              session.username = data.username;
              session.password = data.password;
              console.log(rows[0].username);
              socket.emit("logged", rows[0].username);
            } else {
              socket.emit("logged", "no");
            }
          }
        }
      }
    );
  });

  socket.on("logornot", function () {
    console.log("session:" + session.username);
    if (session.username) {
      console.log("log" + session.username);
      socket.emit("log", { session: "session", user: session.username });
    } else socket.emit("log", "logkro");
  });

  socket.on("logout", function (data) {
    session.username = "";
    session.password = "";
    var defaultStorage = firebase.database().ref(data.username);
    var cfile = defaultStorage.child(data.folder);
    for (x in documents) {
      console.log(documents[x].id);
      console.log(documents[x].doc);
      fs.writeFile(
        "./server_storage/" +
          data.username +
          "@" +
          data.folder +
          "/" +
          documents[x].id,
        documents[x].doc
      );
      cfile.push(documents[x].id);
      console.log("push to cloud:" + Object.keys(documents).length);
    }
    /*fs.readdir('./server_storage/'+data.username+'@'+data.folder+'/', (err, files)=>{
      files.forEach(file => {
        fs.readFile(file, 'utf-8', function(err, data){
          if(err) console.log(err);
          dataarray.push(data)
        });
        console.log(file);
      });
    });
    fs.readFile('padhi', 'utf-8', function(err, data){
        if(err)
        console.log(err);
        socket.emit("upload",data);
    });*/

    console.log(Object.keys(documents).length);
    if (Object.keys(documents).length > 0) {
      console.log("documents.length>0");
      connection.query(
        "select * from project where `projectname`='" +
          data.folder +
          "' AND `count`=" +
          1,
        function (error, rows, fields) {
          if (!!error) {
            console.log("error in the Insert query:" + error);
          } else {
            console.log("project inserted");
          }
          console.log(rows);
          if (rows.length == 1) {
            console.log("rows.length == 1");
            fsize(
              "./server_storage/" + data.username + "@" + data.folder,
              (err, size) => {
                if (err) {
                  throw err;
                }
                console.log(size + " bytes");
                console.log((size / 1024 / 1024).toFixed(2) + " MB");
                var pay = 0;
                if (size > 10) pay = 1;
                connection.query(
                  "update project set `count`=" +
                    0 +
                    ", `size`='" +
                    size.toString() +
                    "', `paid` = " +
                    pay +
                    " where `projectname`='" +
                    data.folder +
                    "'",
                  function (error, rows, fields) {
                    if (!!error) {
                      console.log("error in the Insert query:" + error);
                    } else {
                      console.log("project inserted");
                    }
                  }
                );
              }
            );
            socket.emit("upload", { docu: documents, pro: data.folder });
          }
        }
      );
    } else {
      connection.query(
        "update project set `count`=" +
          0 +
          " where `username`='" +
          data.username +
          "'",
        function (error, rows, fields) {
          if (!!error) {
            console.log("error in the Insert query:" + error);
          } else {
            console.log("project inserted");
          }
        }
      );
      socket.emit("upload", "nofile");
    }
  });

  socket.on("delete", function (data) {
    fdelete("./server_storage/" + data.user + "@" + data.proid, function () {
      console.log("done");
    });
  });
  socket.on("download", function (data) {
    console.log("link:" + data.link[1]);
    fs.mkdir("./server_storage/" + data.projectid, function () {
      console.log("mkdir");
    });

    /* const file = fs.createWriteStream("huahttpdown.txt");
    const request = http.get(data.toString(), function(response){
      response.pipe(file);
    });*/
    for (var i = 0; i < data.link.length; i++) {
      var options = {
        directory: "./server_storage/" + data.projectid + "/",
        filename: data.fname[i],
      };
      download(data.link[i].toString(), options, function (err) {
        if (err) {
          console.log(err);
        }
        console.log("hua download:" + data.link[i]);
      });
    }

    fs.readdir("./server_storage/" + data.projectid + "/", (err, files) => {
      console.log("readdir");
      files.forEach((file) => {
        fs.readFile(file, "utf-8", function (err, data) {
          if (err) console.log(err);
          documents[file] = data;
          console.log("docu:" + documents[file]);
          socket.emit("documents", Object.keys(documents));
          socket.emit("document", { id: file, doc: data });
        });
        console.log(file);
      });
    });
  });
  socket.on("compile", function (data) {
    var code = data.code;
    var input = data.input;
    var inputRadio = data.inputRadio;
    var lang = data.lang;
    console.log("data.code:" + data.code);
    console.log("data.input:" + data.input);
    console.log("data.inputRadio:" + data.inputRadio);
    console.log("data.lang:" + data.lang);

    if (lang === "C" || lang === "C++") {
      if (inputRadio === "true") {
        console.log("inputRadio === true c&c++");
        var envData = { OS: "windows", cmd: "g++" };
        compiler.compileCPPWithInput(envData, code, input, function (data) {
          console.log("true:" + data);
          /*if(data.error)
              {
                socket.emit('error', data.error.text);
                console.log('error'+data.error);
                //res.send(data.error);
              }
              else
              {
                socket.emit('output', data.output);
                //res.send(data.output);
              }*/
          socket.emit("output", { error: data.error, output: data.output });
        });
      } else {
        console.log("inputRadio === false c&c++");
        var envData = { OS: "windows", cmd: "g++" };
        compiler.compileCPP(envData, code, function (data) {
          console.log("c and c++" + data);
          if (data.error) {
            console.log(data.output + "hi friends");
            socket.emit("output", data);
          } else {
            console.log(data.output);
            socket.emit("output", { error: data.error, output: data.output });
          }
        });
      }
    }
    if (lang === "Java") {
      if (inputRadio === "true") {
        var envData = { OS: "windows" };
        console.log(code);
        compiler.compileJavaWithInput(envData, code, function (data) {
          socket.emit("output", data);
          console.log(data);
        });
      } else {
        var envData = { OS: "windows" };
        console.log(code);
        compiler.compileJavaWithInput(envData, code, input, function (data) {
          //socket.emit('output', data);
          socket.emit("output", { error: data.error, output: data.output });
        });
      }
    }
    if (lang === "Python") {
      if (inputRadio === "true") {
        console.log(inputRadio);
        var envData = { OS: "windows" };
        compiler.compilePythonWithInput(envData, code, input, function (data) {
          socket.emit("output", data);
          console.log(data.error);
          console.log(data.output);
        });
      } else {
        console.log(inputRadio);
        var envData = { OS: "windows" };
        compiler.compilePython(envData, code, function (data) {
          socket.emit("output", { error: data.error, output: data.output });
          console.log(data.error);
          console.log(data.output);
        });
      }
    }
    if (lang === "CS") {
      if (inputRadio === "true") {
        var envData = { OS: "windows" };
        compiler.compileCSWithInput(envData, code, input, function (data) {
          socket.emit("output", data);
        });
      } else {
        var envData = { OS: "windows" };
        compiler.compileCS(envData, code, function (data) {
          socket.emit("output", data);
        });
      }
    }
    if (lang === "VB") {
      if (inputRadio === "true") {
        var envData = { OS: "windows" };
        compiler.compileVBWithInput(envData, code, input, function (data) {
          socket.emit("output", data);
        });
      } else {
        var envData = { OS: "windows" };
        compiler.compileVB(envData, code, function (data) {
          socket.emit("output", data);
        });
      }
    }
  });

  const safeJoin = (currentId) => {
    socket.leave(previousId);
    socket.join(currentId);
    previousId = currentId;
  };

  socket.on("getDoc", (docId) => {
    safeJoin(docId);
    console.log("getDoc: docID-" + docId);
    console.log("getDoc: documents[docId]-" + documents[docId]);
    console.log("getDoc: documents:" + documents);
    socket.emit("document", documents[docId]);
  });
  socket.on("addDoc", (doc) => {
    documents[doc.id] = doc;
    safeJoin(doc.id);
    io.emit("documents", Object.keys(documents));
    socket.emit("document", doc);
    console.log("addDoc: doc-" + doc);
    console.log("addDoc: doc.id-" + doc.id);
    console.log("addDoc: Object.keys(documents)-" + Object.keys(documents));
    console.log("addDoc: Object.values(documents)-" + Object.values(documents));
    console.log("addDoc: documents:" + documents);
  });

  socket.on("editDoc", (doc) => {
    documents[doc.id] = doc;
    socket.to(doc.id).emit("document", doc);
    console.log("editDoc: doc-" + doc);
    console.log("editDoc: doc.id-" + doc.id);
    console.log("editDoc: documents:" + documents);
  });

  socket.on("createfile", function (data) {
    fs.writeFile(
      "./server_storage/" + data.username + "@" + data.folder + "/" + data.file,
      ""
    );
  });

  io.emit("documents", Object.keys(documents));
});
console.log("abhi");

app.use(express.static(path.join(__dirname, "dist")));

app.use("/posts", posts);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/ippm/index.html"));
  connection.query("SELECt * from sampletable", function (error, rows, fields) {
    if (!!error) {
      console.log("error in the query");
    } else {
      console.log(rows);
    }
  });
});

/*app.get('/', function (req, res) {

  connection.query("SELECt * from sampletable", function (error, rows, fields) {

    if (!!error) {
      console.log('error in the query');
    }
    else {
      console.log('success');
    }
    
  });
});
*/
//const port = process.env.PORT || 4600;
//http.listen(4600);
http.listen(4600, () => {
  console.log("Listening on port 4600");
});
