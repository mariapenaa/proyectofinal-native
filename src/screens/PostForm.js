import { NavigationRouteContext } from "@react-navigation/native";
import React, {Component} from "react";
import {View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ActivityIndicator} from 'react-native';
import { auth, db } from '../firebase/config';
import MyCamera from '../components/MyCamera';
import { Dimensions } from "react-native";

const WINDOW_HEIGHT = Dimensions.get('window').height;
const CAPTURE_SIZE = Math.floor(WINDOW_HEIGHT * 0.08);

class PostForm extends Component{
    constructor(props){
        super(props)
        this.state={
            textoPost:'',
            showCamera: true,
            url:'',
            dimensions: '',
            loading:false,
        }
    }

    submitPost(){
        console.log(auth.currentUser);
        this.setState({loading:true})
        db.collection('posts').add({
            owner: auth.currentUser.email,
            ownerName:auth.currentUser.displayName,
            texto: this.state.textoPost,
            createdAt: Date.now(),
            photo: this.state.url, 
        })
        .then( ()=>{ //Limpiar el form de carga
            this.setState({
                textoPost:'',
                url:'',
                loading:false,
            })
            db.collection('activity').add({
                owner: auth.currentUser.email,
             
                type: 'post',
                createdAt: Date.now(),
                postBy:auth.currentUser.email,
            })
            //Redirección
            this.props.drawerProps.navigation.navigate('Home')
        })
        .catch()
    }
    onImageUpload(url){
        this.setState({
            showCamera: false,
            url:url
        })
    }


    render(){
        return(
            <View style={styles.formContainer}>
                {this.state.showCamera ? <MyCamera onImageUpload={(url)=> {this.onImageUpload(url)}} style={{ flex: 1 }}/> : 
                <View style={styles.formContainer}> 
                <React.Fragment style={styles.imageContainer}>
                    <Image 
                        style={styles.photo}
                        source={{uri:this.state.url}}/> 
                {this.state.loading ?<ActivityIndicator style={styles.loader} size="large" /> : <Text></Text> } 
                </React.Fragment>
                <TextInput
                    style={styles.input}
                    onChangeText={(text)=>this.setState({textoPost: text})}
                    placeholder='Escribí aquí'
                    keyboardType='default'
                    multiline
                    value={this.state.textoPost}    
                    />
                <TouchableOpacity style={styles.button} onPress={()=>this.submitPost()}>
                    <Text style={styles.textButton}>Guardar</Text>    
                </TouchableOpacity>
                </View>
     } 
            </View>
        )
    }
}

const styles = StyleSheet.create({
    formContainer:{
        paddingHorizontal:10,
        marginTop: 20,
        flex:1,
    },
    imageContainer:{
        position:'relative'
    },
    loader:{
        position:'absolute',
        top:'40%',
        right:'35%'
    },
    photo:{
        flex:1
    },
    input:{
        height:100,
        paddingVertical:15,
        paddingHorizontal: 10,
        borderWidth:1,
        borderColor: '#ccc',
        borderStyle: 'solid',
        borderRadius: 6,
        marginVertical:10,
    },
    button:{
        backgroundColor:'#28a745',
        paddingHorizontal: 10,
        paddingVertical: 6,
        textAlign: 'center',
        borderRadius:4, 
        borderWidth:1,
        borderStyle: 'solid',
        borderColor: '#28a745',
        marginBottom:10,
    },
    textButton:{
        color: '#fff'
    },

})

export default PostForm;