import React, {useState} from "react";
import {Button} from "@material-ui/core";
import firebase from "firebase";
import {storage, db} from "./firebase";



function ImageUpload({username}) {
    const [image, setImage] =useState(null);
    const [progress, setProgress] =useState(0);
    const [caption, setCaption] =useState('');

    const handleChange = (e) => {
        if(e.target.files[0]){      // Get the first file that is selected
            setImage(e.target.files[0]);    // Set the image in state to that
        }
    };

    /* Push to firebase*/
    const handleUpload = () => {
        /* Get access to the storage in firebase. Get a reference to a folder
           called images. In essence you're creating that folder.
           image.name is the file name that we have chosen.
           .put(image) is putting the image that you grabbed into that reference
        */
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        /* We need to listen to what is happen now
           So whenever the state is changed give us a snapshot
        */
        uploadTask.on("state_changed", (snapshot) => {
            //progress function
            const progress = Math.round(
                (snapshot.bytesTransferred/snapshot.totalBytes) * 100
            );
            setProgress(progress);
        },
            (error) => {
             console.log(error);
             alert(error.message);
        },
            /* Go and get the download link from firebase so we can use it */
            () => {
             storage.ref("images").child(image.name).getDownloadURL()
                 /* Do some stuff with the url */
                 .then(url => {
                     console.log("This is firing off");
                     db.collection("posts").add({
                         /* Will allow all recent posts to come to the top
                            Go and get the firebase timestamp so it's
                            universal throughout the world
                         */
                         // timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                         timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                         caption: caption,
                         imageUrl: url,
                         username: username
                     });

                     setProgress(0);
                     setCaption("");
                     setImage(null);
                 });
            }
        );
    };


    return (
        <div>
            < progress value={progress} max="100"/>
            <input type="text" placeholder='Enter a caption...' onChange={event => setCaption(event.target.value)} value={caption}/>
            <input type="file" onChange={handleChange}/>
            <Button onClick={handleUpload}>Upload</Button>

        </div>


    )
}

export default ImageUpload

