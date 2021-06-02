import { Component, OnInit, OnDestroy, ViewChild, Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DocumentService } from 'src/app/document.service';
import { Document } from 'src/app/document';
import { startWith } from 'rxjs/operators';
import { TeamComponent } from '../team/team.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NewprojectComponent } from '../newproject/newproject.component';
import { NewfileComponent } from '../newfile/newfile.component';
import { Router } from '@angular/router';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import {FormControl} from '@angular/forms';

export interface DialogData {
  file: string;
  name: string;
}
export interface DialogData2 {
  filename: string;
  name: string;
}
export interface DialogData3 {
  proid: string;
}
const defaults = {
  markdown:
    '# Welcome To IPPM .........\n # Markdown Mode has been activated.....',
  'text/typescript':
    `/* Welcome To IPPM .........*/
    //TypeScript Mode has been activated.....
    `, python:'# python ',
    vbscript:'# VbScript',
    clike:'// Programming Languagemode like c,c++,c#,java,etc'
};
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class EditorComponent implements OnInit, OnDestroy {
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  downloadurl : Observable<string>;
  mode = 'Python';
 tabs = ['First'];
  document: Document;
  documents: Observable<string[]>;
  currentDoc: string;
  _docSub: Subscription;
  userS: Subscription;
  userE: Subscription;
  gotmsg: Subscription;
  error: Subscription;
  output: Subscription;
  logged: Subscription;
  upload: Subscription;
  download: Subscription;
   private chatSub: Subscription;
username: string;
@ViewChild('video') myvideo: any;
public langu;
file: string;
name: string;
peer;
proid: string;
anotherid;
mypeerid; nu = [1,2,3,4];
items = [];
dummy = {1:{id:'ajay', doc:'singh'}, 2:{id:'anshu', doc:'sing'}};
choose(){
  this.documentService.existing(this.documentService.getname());
  const dialogRef = this.dialog.open(TeamComponent, {
    width: '400px',
    data: {proid:this.proid}
    });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    //this.animal = result;
    //this.items = this.documentService.getmember();
    //this.documentService.tproject({projectid: result, user:document.getElementById('setusername').innerHTML});
    console.log("result:"+result);
    document.getElementById('spannew').innerHTML = result;
  });
}
execute(){
  console.log("reached");
/*if(data.target.value === "dashboard")
{
console.log("dashboard");
}
if(data.target.value === "logout")
{*/
  this.documentService.logout({username:this.documentService.getname(), folder:document.getElementById('spannew').innerHTML});
  console.log("logout");
}
createproject(data): void {
  console.log("create project:"+data);
  const dialogRef = this.dialog.open(NewprojectComponent, {
    width: '400px',
    data: {name: data, file: this.file}
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    //this.animal = result;
    //this.items = this.documentService.getmember();
    console.log("result:"+result);
    document.getElementById("spannew").innerHTML = result;
  });
}
setlang(data){
  console.log("selected language:"+data.target.value);
  this.langu = data.target.value;
  if(this.langu === "Python"){
    this.mode = 'python';
    this.options = {
      ...this.options,
      mode: this.mode,
    };
    console.log(this.options.mode);
  }
  if(this.langu === "Java" || this.langu === "C" || this.langu === "C++"){
    this.mode = 'clike';
    this.options = {
      ...this.options,
      mode: this.mode,
    };
    console.log(this.options.mode);
  }
}

compile(code, input, inputRadio){
  console.log("compile:");
  this.documentService.sendCode({code: code, input: input, lang: this.langu, inputRadio: inputRadio});
}
   setUsername(name: string){
     console.log(name);
     this.documentService.setUsername(name);
     }

    sendmsg(msg: string, name: string){
      this.documentService.sendMessage({message: msg, user: name});
    }
    loadDoc(id: string) {
      this.documentService.getDocument(id);
    }
  
    newDoc(): void {
  const dialogRef = this.dialog.open(NewfileComponent, {
    width: '250px',
    data: {name: this.name, file: this.file}
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    //this.animal = result;
    console.log("result:"+result);
    this.documentService.newDocument(result);
    this.documentService.makefile({username:this.documentService.getname(), folder:document.getElementById('spannew').innerHTML, file:result});
    this.tabs.push(result);
  });
    }
openForm()
{
  document.getElementById("myForm").style.display = "block";
}

closeForm(){
  document.getElementById("myForm").style.display = "none";
}

editDoc() {
  this.documentService.editDocument(this.document);
}
//private afStorage: AngularFireStorage
  constructor(private afStorage: AngularFireStorage ,private documentService: DocumentService, public dialog: MatDialog, private router: Router) { 
    //document.getElementById("setusername").innerHTML = this.documentService.getname();
  }

  ngOnInit() {
    console.log("nu length:"+this.nu.length);
    for(let i in this.dummy){
      console.log(this.dummy[i].doc);
    }
    this.userS = this.documentService.userS.subscribe(doc => document.getElementById('error-container').innerHTML = doc.username);
    this.userE = this.documentService.userE.subscribe(doc => document.getElementById('error-container').innerHTML = doc);
    this.gotmsg = this.documentService.gotmsg.subscribe(doc => 
      document.getElementById('message-container').innerHTML += '<div><b><font size="2">' + doc.user + '</font>=>' 
      + '</b><font size="2">' + doc.message + '</font></div>');
      this.error = this.documentService.error.subscribe(doc => {console.log("error:"+doc); document.getElementById('output').innerHTML += doc});
      this.output = this.documentService.output.subscribe(doc => {console.log("output:"+doc); 
      console.log("error:"+doc.error+",output:"+doc.output);
      if(String(doc.error) === "undefined"){
        console.log(doc.output);
        document.getElementById('output').innerHTML += doc.output
      }
      else{
        console.log(doc.error);
        document.getElementById('output').innerHTML += "Error:"+doc.error+'\\\n'
      }});
      //this.logged = this.documentService.logged.subscribe(doc=> {console.log("welcome:"+doc); document.getElementById('setusername').innerHTML = "Welocome "+doc});
      this.documents = this.documentService.documents;
      this._docSub = this.documentService.currentDocument.subscribe(doc => this.currentDoc = doc.id);
      this._docSub = this.documentService.currentDocument.pipe(
        startWith({ id: '', doc: 'Select an existing document or create a new one to get started'})
      ).subscribe(document => this.document = document);
      document.getElementById("setusername").innerHTML = 'Welcome &#9786 '+this.documentService.getname();
      this.upload = this.documentService.upload.subscribe(doc=> {console.log(doc);
        if(String(doc) != "nofile")
        {console.log("upload to storage");
          for(let i in doc.docu){
            console.log("id:"+doc.docu[i].id+"doc:"+doc.docu[i].doc);
        var filepath = 'ippm/'+this.documentService.getname()+'/'+doc.pro+'/'+doc.docu[i].id;
        this.ref = this.afStorage.ref(filepath);
        this.task = this.ref.putString(doc.docu[i].doc);
      }}
      this.documentService.delete({user: this.documentService.getname(), proid: document.getElementById('spannew').innerHTML});
      this.router.navigate(['/', 'home']);
      //this.afStorage.ref('ajay/folder').getDownloadURL().subscribe(urllink => {console.log("url:"+urllink);
      //this.documentService.download(urllink);});
      });
      this.download  = this.documentService.link.subscribe(doc=> {
        console.log(doc);
        var links = [];
        for(let i of doc.fname){
            this.afStorage.ref('ippm/'+doc.uname+'/'+doc.pro+'/'+i).getDownloadURL().subscribe(urllink=>{
              links.push(urllink);
              //console.log(links);
              if(links.length === doc.fname.length)
              this.documentService.download({link:links, fname:doc.fname, projectid:document.getElementById('spannew').innerHTML});
            });
            console.log(links);
        }
        console.log(links);
      });
      this.peer = new Peer(); 
      setTimeout(()=>
      {
        this.mypeerid = this.peer.id;
      }, 3000);
      this.peer.on('connection', function(conn) {
        conn.on('data', function(data){
          console.log(data);
        });
      });
      var n = <any>navigator;
      let video = this.myvideo.nativeElement;

      n.getUserMedia = n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia;

this.peer.on('call', function(call) {
  n.getUserMedia({video: true, audio: true}, function(stream) {
    call.answer(stream); // Answer the call with an A/V stream.
    call.on('stream', function(remotestream) {
      // Show stream in some video/canvas element.
     // video.src = URL.createObjectURL(remotestream);
      video.srcObject = remotestream;

      video.play();
    });
  }, function(err) {
    console.log('Failed to get local stream' ,err);
  });
});
    }
  ngOnDestroy() {
    
  }
  startvideo()
  {
      let video = this.myvideo.nativeElement;
      var localvar = this.peer;
      var peerid = this.anotherid;

      var n = <any>navigator;
      n.getUserMedia = n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia;

      n.getUserMedia({video: true, audio: true}, function(stream) {
        var call = localvar.call(peerid, stream);
        call.on('stream', function(remotestream) {
          // Show stream in some video/canvas element.
       // video.src = URL.createObjectURL(remotestream);
        video.srcObject = remotestream;
        video.play();
        });
      }, function(err) {
        console.log('Failed to get local stream' ,err);
      });
  }
  connect()
  {
    var conn = this.peer.connect(this.anotherid);
// on open will be launch when you successfully connect to PeerServer
conn.on('open', function(){
  // here you have conn.id
  conn.send('hi!');
});
  }

  //codemirror section

readOnly = false;
  //mode = 'markdown';
  theme='3024-day';
//  colors = ["#fcc", "#f5f577", "#cfc", "#aff", "#ccf", "#fcf"];
  //rulers=[];

  options: any = {
    lineNumbers: true,
  theme:this.theme,
    mode: this.mode,
    autoCloseBrackets: true,
    autoCloseTags:true,
    matchBrackets:true,
    showTrailingSpace: true,
    
     //rulers:[{color:this.colors, column: 10, lineStyle: "dashed"}],
    
    //enableSearchTools: true,
    //highlightSelectionMatches: true,
    //highlightMatches: true,
    foldGutter:true,
    styleActiveLine: true,
    fullscreen:false,
    scrollbarStyle:'overlay',
    enableCodeFolding: true,
    //reference:https://github.com/codemirror/CodeMirror/issues/2674
    //reference:https://ckeditor.com/cke4/addon/codemirror
    gutters: ['CodeMirror-lint-markers','CodeMirror-linenumbers', 'CodeMirror-foldgutter'],

    extraKeys: {"Ctrl-Space": "autocomplete"
  }

    
  };
  defaults = defaults;

 /* changeMode() {
    this.options = {
      ...this.options,
      mode: this.mode,
    };
  }*/
  changeTheme(){
    this.options = {
      ...this.options,
      theme: this.theme,
    };
  }
  // f11Click(){
  //   this.options = {
  //     ...this.options,
  //     fullscreen:true,
  //   };
  // }

  handleChange($event) {
    console.log('ngModelChange', $event);
  }

  clear() {
    this.defaults[this.mode] = '';
  }
}


