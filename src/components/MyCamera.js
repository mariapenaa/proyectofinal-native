import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { db, storage } from '../firebase/config'

class MyCamera extends Component {
    constructor(props){
        super(props);
        this.state={
            permission: false,
            photo: '',
            showCamera: true,
        }
        this.camera 
    }


componentDidMount(){
    Camera.requestCameraPermissionsAsync()
    .then(()=>{
        this.setState({
            permission:true,
        })
    })
    .catch(e=> console.log(e))
}

takePicture(){
    this.camera.takePictureAsync()
    .then((photo)=>{
        this.setState({
            photo: photo.uri,
            showCamera: false, 
        })
    })
    .catch( e => console.log(e))
}

savePhoto(){
    fetch(this.state.photo)
        .then(res => res.blob())
        .then(image => {
            const ref = storage.ref(`photos/${Date.now}.jpg`)
            ref.put(image)
            .then(()=>{
                ref.getDownloadURL()
                .then( url =>{
                    this.props.onImageUpload(url);
                    this.setState({
                        photo:'',
                    })
                })
            })
            .catch(e => console.log(e))
        })
        .catch(e=> console.log(e))

}

clear(){
    this.setState({
        photo:'',
        showCamera: true,
    })
}

render(){
    return(
        <View style={styles.container}>
            {this.state.permission ?
            this.state.showCamera === false ?
        <React.Fragment>
            <Image 
            style={styles.cameraBody}
            source={{uri:this.state.photo}}/>
        <View>
            <TouchableOpacity onPress={()=> this.savePhoto()}><Text> Aceptar </Text></TouchableOpacity>
            <TouchableOpacity onPress={()=> this.clear()}> <Text> Rechazar</Text></TouchableOpacity>
        </View>
        </React.Fragment>:
        <View style={styles.container}>
            <Camera
             style={styles.CameraBody}
            type={Camera.Constants.Type.back}
            ref={reference => this.camera = reference}
            />
            <TouchableOpacity onPress={()=> this.takePicture()} style={styles.button}>
                <Text>Sacar Foto</Text></TouchableOpacity>
            </View> : <Text> No tienes permisos para usar la camara</Text> } </View>
    )
}
}
const styles= StyleSheet.create({
    container:{
        flex: 1,
        minHeight:'80vh'
    },
    cameraBody:{
        flex:7,
    },
    button:{
        flex: 1,
        justifyContent: 'center',
    },
})

export default MyCamera;