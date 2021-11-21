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
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttonGreen} onPress={()=> this.savePhoto()}><Text style={styles.text}> Aceptar </Text></TouchableOpacity>
                <TouchableOpacity style={styles.buttonRed} onPress={()=> this.clear()}> <Text style={styles.text}> Rechazar</Text></TouchableOpacity>
            </View>
            </React.Fragment>:
            <View style={styles.container}>
                <Camera
                style={styles.CameraBody}
                type={Camera.Constants.Type.back}
                ref={reference => this.camera = reference}
                />
                <TouchableOpacity onPress={()=> this.takePicture()} style={styles.button}>
                    <Text style={styles.text}>Sacar Foto</Text></TouchableOpacity>
                </View> :<Text style={styles.noPermisos}> No tienes permisos para usar la camara</Text> } 
        </View>
    )
}
}
const styles= StyleSheet.create({
    container:{
        flex: 1,
        justifyContent:'center'
    },
    cameraBody:{
        flex:7,
    },
    text:{
        color:'white'
    },
    noPermisos:{
        fontSize:'2rem',
        fontColor:'red',
        textAlign:'center'
    },
    button:{
        backgroundColor:'#2b1e49',
        paddingHorizontal: 10,
        paddingVertical: '0.7rem',
        textAlign: 'center',
        marginTop:'2rem',
        marginBottom:'1.4rem',
        borderRadius:4, 
        fontSize:'1rem',
        boxShadow:'0px 6px 16px 0px rgba(0,0,0,0.37);'
    },
    buttonRed:{
        paddingHorizontal: 10,
        paddingVertical: '0.7rem',
        textAlign: 'center',
        marginTop:'2rem',
        marginBottom:'1.4rem',
        borderRadius:4, 
        backgroundColor:'red',
        fontSize:'1rem',
        marginLeft:5,
        boxShadow:'0px 6px 16px 0px rgba(0,0,0,0.37);',
        width:'50%'
    },
    buttonGreen: {
        paddingHorizontal: 10,
        width:'50%',
        paddingVertical: '0.7rem',
        textAlign: 'center',
        marginTop:'2rem',
        marginRight:5,
        marginBottom:'1.4rem',
        borderRadius:4, 
        fontSize:'1rem',
        boxShadow:'0px 6px 16px 0px rgba(0,0,0,0.37);',
        backgroundColor:'green'
    },
    buttonContainer:{
        flexDirection:'row',
        justifyContent:'center'
    }
})

export default MyCamera;