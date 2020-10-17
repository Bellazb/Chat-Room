// adding new chat documents
// setting up a real-time listener to get new chats
// updating the username
// updating the room

class Chatroom {
    constructor(room, username){
        this.room = room;
        this.username = username;
        this.chats = db.collection('chats');
        this.unsub;
    }
    async addChat(message){
        //format a chat object
        const now = new Date();
        const chat = {
            message,
            username: this.username,
            room: this.room,
            created_at: firebase.firestore.Timestamp.fromDate(now)

        };
        //save the chat document
        const response = await this.chats.add(chat);
        return response;
    }
    getChats(callback){
        //if we invoke the this.unsub it will unsubcribe changes, means it will reset the initial call
        this.unsub = this.chats
        .where('room', '==', this.room)
        .orderBy('created_at')
        .onSnapshot(snapshot =>{
            snapshot.docChanges().forEach(change =>{
                console.log(change);
                // console.log(snapshot);
                if(change.type == 'added'){
                  // update the ui
                  callback(change.doc.data());
                }
            })
        })
    }
    updateNames(username){
        this.username = username;
        localStorage.setItem('username', username);
    }
    updateRoom(room){
        //update current room
        this.room = room;
        console.log('room updated');
        console.log(room);
        //unsubcribe changes from prevoius room
        if(this.unsub){
            console.log('test');
           this.unsub();
           console.log(room);
        }
    }
}

// const chatroom = new Chatroom('general', 'shaun');
// // console.log(chatroom);

// // chatroom.addChat('hello everyone')
// //  .then(()=>{
// //      console.log('chat added');
// //  }).catch(err => console.log(err));

// chatroom.getChats((data) =>{
//     console.log(data);
// })

// chatroom.updateRoom('gaming');
// chatroom.getChats((data) =>{
//     console.log(data);
// })

// setTimeout(() =>{
// chatroom.updateRoom('gaming');
// chatroom.updateNames('yoshi');
// chatroom.getChats((data) =>{
//     console.log(data);
// });
// chatroom.addChat('hello');
// },3000);


