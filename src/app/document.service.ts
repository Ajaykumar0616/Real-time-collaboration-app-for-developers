import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
//import { Observable } from 'rxjs';
import { Document } from './document';
@Injectable({
  providedIn: 'root'
})
export class DocumentService {

public username = "";
public items = [];
  currentDocument = this.socket.fromEvent<Document>('document');
  documents = this.socket.fromEvent<string[]>('documents');
  userE = this.socket.fromEvent<any>('userExists');
  userS = this.socket.fromEvent<any>('userSet');
  gotmsg = this.socket.fromEvent<any>('newmsg');
  error=this.socket.fromEvent<any>('error');
  output=this.socket.fromEvent<any>('output');
  logged = this.socket.fromEvent<any>('logged');
  log = this.socket.fromEvent<any>('log');
  emailsend = this.socket.fromEvent<any>('emailsend');
  upload = this.socket.fromEvent<any>('upload');
  prolist = this.socket.fromEvent<any>('prolist');
  link = this.socket.fromEvent<any>('link');
  constructor(private socket: Socket) { }
setname(data){
  this.username=data;
}

tproject(data)
{
  this.socket.emit("tproject", data);
}
delete(data){
  this.socket.emit("delete", data);
}
existing(data){
  this.socket.emit("existing_project", data);
}
getname(){
  return this.username;
}
member(data){
  console.log("service member:"+data);
this.socket.emit("createmember", data);
}
logout(data){
this.socket.emit("logout", data);
}
  forget(data){
    this.socket.emit("forget", data);
  }
logornot()
{
  this.socket.emit("logornot");
}

login(data)
{console.log("document.service");
  this.socket.emit("login", data);
}
signup(data){
  this.socket.emit("signup", data);
}

sendCode(data){
  this.socket.emit("compile", data);
}

  sendMessage(msg){
    console.log("username:"+msg.user+",msg:"+msg.message);
    this.socket.emit("msg", msg);
}

setUsername(msg: string){
  this.socket.emit("setUsername", msg);
}

  getDocument(id: string) {
    this.socket.emit('getDoc', id);
  }

  newDocument(data) {
    this.socket.emit('addDoc', { id: data, doc: '' });
  }

  editDocument(document: Document) {
    this.socket.emit('editDoc', document);
  }

  download(data){
    this.socket.emit('download', data);
  }
makefile(data)
{
  this.socket.emit('createfile',data);
}

  private docId() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
}
