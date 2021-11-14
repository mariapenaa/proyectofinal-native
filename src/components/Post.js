import React, { Component } from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image, Modal, FlatList} from 'react-native';
import { db } from '../firebase/config';
import firebase from 'firebase';
import { auth } from '../firebase/config';
import { TextInput } from 'react-native-gesture-handler';

class Post extends Component{
    constructor(props){
        super(props);
        this.state = {
           likes: 0,
           myLike: false,
           showModal: false,
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
    showModal(){
        this.setState({
            showModal: true,
        })
    }
    hideModal(){
        this.setState({
            showModal: false,
        })
    }
    guardarComentario(){
        let comentario ={
            createdAt: Date.now(),
            author: auth.currentUser.email,
            text: this.state.comment, 
        }
        db.collection('posts').doc(this.props.postData.id).update({
            comments: firebase.firestore.FieldValue.arrayUnion(comentario)
        })
        .then(()=> {
            this.setState({
                comment: ''
            })
        })
    }

    render(){
        return(
            <View style={styles.contanier}>
                <Text>Texto del post: {this.props.postData.data.texto}</Text>
                <Text>user: {this.props.postData.data.owner} </Text> 
                <Text>Likes: {this.state.likes}</Text>   
                {this.state.myLike == false ? 
                <TouchableOpacity onPress={()=> this.darLike()}><Image style={styles.image} source={require('../../assets/like.png')} resizeMode='contain'/></TouchableOpacity>:
                <TouchableOpacity onPress ={()=> this.sacarLike()}><Image style={styles.image} source={require('../../assets/dislike.png')} resizeMode='contain'/></TouchableOpacity>}      
                <TouchableOpacity onPress={()=> this.showModal()}><Text> Ver Comentarios</Text></TouchableOpacity>
                {this.state.showModal ?
                    <Modal  visible={this.state.showModal} animationType='fade' transparent={true}>
                        <View style={styles.container}>
                            <View style={styles.modalView}>
                                <TouchableOpacity onPress={()=> this.hideModal()} ><Image style={styles.image} source={require('../../assets/cerrar.png')} resizeMode='contain'/></TouchableOpacity>
                                <FlatList
                                data={this.props.postData.data.comments}
                                keyExtractor={ comment =>comment.createdAt.toString()}
                                renderItem={ ({item}) => <Text> {item.author}:{item.text}</Text>}/> 
                                <View> 
                                    <TextInput placeholder="Comentar..." keyboardType="default" multiline onChangeText={(text)=> this.setState({ comment: text })} Value={this.state.comment} /> 
                                    <TouchableOpacity onPress={()=> this.guardarComentario()}> <Text>Guardar Comentario</Text> </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal> : <Text></Text> }
            </View>
        )
    }

}


const styles = StyleSheet.create({
    contanier:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    image:{
        height:20,
    },

    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
    modalContainer: {

    }
})

export default Post

