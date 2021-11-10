import React, { Component } from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { db } from '../firebase/config';
import firebase from 'firebase';
import { auth } from '../firebase/config'

class Post extends Component{
    constructor(props){
        super(props);
        this.state = {
           likes: 0,
           myLike: false,
           showMOdal: false,
           comment: '',
        }
    }
    componentDidMount(){
        if(this.props.postData.data.likes){
            this.setState({
                likes: this.props.postData.data.likes.length,
                myLike: this.props.postData.data.likes.includes(auth.currentUser.email)
            })
        }
    }
    darLike(){
        db.collection('posts').doc(this.props.postData.id).update({
            likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email)
        })
        .then(()=> {
            this.setState({
                likes: this.props.postData.data.likes.length,
                myLike: true,
            })
        })
    }
    sacarLike(){
        db.collection('posts').doc(this.props.postData.id).update({
            likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email)
        })
        .then(()=>{
            this.setState({
                likes: this.props.postData.data.likes.length,
                myLike: false, 
            })
        })
    }

    render(){
        console.log(this.props);
        return(
            <View style={styles.contanier}>
                <Text>Texto del post: {this.props.postData.data.texto}</Text>
                <Text>user: {this.props.postData.data.owner} </Text> 
                <Text>Likes: {this.state.likes}</Text>   
                {this.state.myLike == false ? 
                <TouchableOpacity onPress={()=> this.darLike()}><Image style={styles.image} source={require('../../assets/like.png')} resizeMode='contain'/></TouchableOpacity>:
                <TouchableOpacity onPress ={()=> this.sacarLike()}><Image style={styles.image} source={require('../../assets/dislike.png')} resizeMode='contain'/></TouchableOpacity>}      
            </View>
        )
    }

}


const styles = StyleSheet.create({
    contanier:{
        marginBottom: 20,
        borderRadius:4,
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 10,
    },
    image:{
        height: 20,
    }
})

export default Post

