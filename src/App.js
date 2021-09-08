import React, {useEffect, useState} from 'react';
import './App.css';
import Post from "./Post";
import {db, auth} from "./firebase";
import {makeStyles} from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import {Button, Input} from "@material-ui/core";
import ImageUpload from "./ImageUpload";

// Material UI styling
function getModalStyle() {
    const top = 50 ;
    const left = 50 ;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

function App() {

    const classes = useStyles();    //Basically just to use the above styling
    const [modalStyle] = useState(getModalStyle);

    /* A piece of state*/
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);  //This allows us to use it below.

  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);       // To keep track of the user. Default value of null;

  // This will run once when we run the app
  useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((authUser)  => {          // It listen to any changes that occurr (createUser, login, logout)
          if(authUser)
          {
              // User has logged in
              console.log(authUser);        // To see from the console whether someone is logged in or not
              setUser(authUser);        // Capture the user inside of our state
              /*
               This is cool because it survives a refresh. If you refreshed it would keep you logged
               in because it uses cookies tracking. It sets the piece of state
               */
          }
          else
          {
              setUser(null);       // If the user is logged out set user to null
          }
          return () => {
              // If the useEffect fires again perform some cleanup actions
              unsubscribe();
          }
          /*
              * We log in , update the username. It will refire the "frontend" code
              * But before it does that detach the listener you set up so there's no duplicates
           */

      })

  }, [user, username]);
  /*
    We're creating a user and updating username so we have to include them as dependencies
    Because we're saying everytime they change they have to be fired off
  */

  // useEffect-> Runs a piece of code based on a specific condition
  // This is a listener for the database
    useEffect(()=>{
        db.collection('posts').onSnapshot(snapshot => {
            // docs is getting the documents from the firebase database
            // doc.data will give you all the properties from the collection(eg. caption,username,img)
            setPosts(snapshot.docs.map(doc => ({
                id: doc.id,
                post: doc.data()
            })));
        })
    },  []);

    const signUp = (event) => {
        event.preventDefault();      // This is so it doesn't cause a refresh when we submit the form
        auth.createUserWithEmailAndPassword(email, password)    // This is where the user is created
            // If we just created someone
            /*
              We're saying go to the user you just logged in with
              Update their profile
              And set their display name to username
            */
            .then((authUser) => {
                return authUser.user.updateProfile({
                    displayName: username
                })
            })

         .catch((error) => alert(error.message));
            setOpen(false);
    };

  const signIn = (event) => {
        event.preventDefault();

        auth.signInWithEmailAndPassword(email, password)
        .catch((error) => alert(error.message));
      setOpenSignIn(false);
  };


  return (
      <div className="App">
      {user?.displayName ? (
          <ImageUpload username={user.displayName}/>
      ): (
          <h3>Sorry you need to login to upload</h3>
      )}


          <Modal
              open={open}
              onClose={() => setOpen(false)}    // This is so that when you click outside the modal it closes
          >
              <div style={modalStyle} className={classes.paper}>
                  <form className="app_signUp">
                      <div className="centerTheModalImage">
                          <img
                              className="app_headerImage"
                              src = "https://emilyannebondoc.files.wordpress.com/2014/09/instagram-header.png?w=640"
                              alt=""
                          />
                      </div>

                      <Input
                          placeholder="username"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                      />

                      <Input
                          placeholder="email"
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                      />
                      <Input
                          placeholder="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                      />
                      <Button type="submit" onClick={signUp}>Sign Up</Button>
                  </form>
              </div>
          </Modal>

          <Modal
              open={openSignIn}
              onClose={() => setOpenSignIn(false)}    // This is so that when you click outside the modal it closes
          >
              <div style={modalStyle} className={classes.paper}>
                  <form className="app_signUp">
                      <div className="centerTheModalImage">
                          <img
                              className="app_headerImage"
                              src = "https://emilyannebondoc.files.wordpress.com/2014/09/instagram-header.png?w=640"
                              alt=""
                          />
                      </div>

                      <Input
                          placeholder="email"
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                      />
                      <Input
                          placeholder="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                      />
                      <Button type="submit" onClick={signIn}>Sign In</Button>
                  </form>
              </div>
          </Modal>

          <div className="app_header">
              <img className="app_headerImage" src="https://emilyannebondoc.files.wordpress.com/2014/09/instagram-header.png?w=640" alt=""/>
          </div>

          {user ? (
              <Button onClick={() => auth.signOut()}>Logout</Button>
          ): (
              <div className="app_loginContainer">
                  <Button onClick={() => setOpenSignIn(true)}>Sign in</Button>
                  <Button onClick={() => setOpen(true)}>Sign up</Button>
              </div>

          )}


          <h1> This is a react app in development</h1>

          {    /* Basically loops through the posts from above */
              posts.map(({id, post}) =>(
                  <Post username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
              ))
          }

      </div>
  );
}

export default App;

/*
 --> In order to differentiate one component from another. We use props
 --> Since we don't want to hardcode everything. So we will use state.
     State is a short term memory store in react.
     State by defualt is not persistent
 --> When we start talking about posts, we refer to them as documents
 --> For Snapshot. It's an event listener. Anytime a change is detected it will
 reload this bit of code.
--> Map is basically a for loop
--> The id functionality allows individual posts to be added instead of refreshing
the entire page
--> With regards to modals:
        --> Need a piece of state to keep track of when its open
        --> Need and onClose method to handleClose functions
--> A way to think about the useEffect for onAuthStateChanges
        --> useEffect is "frontend" listener
        --> .onAuthStateChanged is a "backend" listener


*/