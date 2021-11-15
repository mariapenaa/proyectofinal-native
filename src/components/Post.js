import React, { Component } from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image, Modal, FlatList} from 'react-native';
import { db } from '../firebase/config';
import firebase from 'firebase';
import { auth } from '../firebase/config';
import { TextInput } from 'react-native-gesture-handler';
import { Icon } from 'react-native-eva-icons';


class Post extends Component{
    constructor(props){
        super(props);
        this.state = {
           likes: 0,
           myLike: false,
           showModal: false,
           comment: '',
           comments:0
        }
    }
    componentDidMount(){
        console.log(this.props.postData)

            this.setState({
                likes: this.props.postData.data.likes ? this.props.postData.data.likes.length : 0,
                comments: this.props.postData.data.comments ? this.props.postData.data.comments.length : 0,
                myLike: this.props.postData.data.likes ? this.props.postData.data.likes.includes(auth.currentUser.email) : false,
            })

    }
    darLike(){
        db.collection('posts').doc(this.props.postData.id).update({
            likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email)
        })
        .then(()=> {
            this.setState({
                likes: this.state.likes +1,
                myLike: true,
            })
            db.collection('activity').add({
                owner: auth.currentUser.email,
                type: 'like',
                createdAt: Date.now(),
                postBy:this.props.postData.data.owner, 
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
            db.collection('activity').add({
                owner: auth.currentUser.email,
                type: 'unlike',
                createdAt: Date.now(),
                postBy:this.props.postData.data.owner, 
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
        console.log(this.props)
        db.collection('posts').doc(this.props.postData.id).update({
            comments: firebase.firestore.FieldValue.arrayUnion(comentario)
        })
        .then(()=> {
            db.collection('activity').add({
                owner: auth.currentUser.email,
                type: 'comment',
                createdAt: Date.now(),
                postBy:this.props.postData.data.owner, 
                comment:this.state.comment
            })
            this.setState({
                comment: '',
                comments:this.state.comments +1,
            })
        })
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.user}>
                    <Text style={styles.userMain}>@{this.props.postData.data.ownerName ? this.props.postData.data.ownerName: ''} </Text> 
                    <Text style={styles.userSecond}>{this.props.postData.data.owner} </Text> 
                </View>
                <View style={styles.imgContainer}>
                    {this.props.postData.data.photo ? 
                    <Image 
                    style={styles.photo}
                    source={{uri:this.props.postData.data.photo}}/> : ''}
                </View>
                <View style={styles.actionContainer}>
                    <View style={styles.actionLine}>
                        {this.state.myLike == false ? 
                        <><TouchableOpacity onPress={()=> this.darLike()}> <Icon name='heart-outline' width={30} height={30}/></TouchableOpacity><Text style={styles.subText}>{this.state.likes}</Text></>:
                        <><TouchableOpacity onPress ={()=> this.sacarLike()}><Icon name='heart' width={30} height={30} fill="red"/></TouchableOpacity><Text style={styles.subText}>{this.state.likes}</Text></>}      
                        <TouchableOpacity onPress={()=> this.showModal()}><Icon name='message-circle-outline' width={30} height={30} /></TouchableOpacity><Text style={styles.subText}>{this.state.comments}</Text>
                    </View>
                   {/*  <Text>Likes: {this.state.likes}</Text>    */}
                    <Text>{this.props.postData.data.texto}</Text>
                </View>
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
    container:{
        marginHorizontal:20,
        marginVertical:10,
        borderRadius:20,
        border:'solid pink 1px',
        padding:20,
        backgroundColor:'white',
        flex:1,
        boxSizing:'border-box',
        minHeight:'50vh'
    },
    photo:{
        flex:1
    },
    imgContainer: {
        width:'100%',
        flex:4,
    },
    image: {
        width:20,
        height:20,
        flex:1,
    },
    user:{
        flex:1,
    },
    userMain:{
        fontSize:16,
    },
    userSecond:{
        fontSize:13,
        color:'grey'
    },
    actionContainer:{
        flex:2
    },
    subText:{
        color:'black',
        marginRight:12,
    },
    actionLine:{
        display:'flex',
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'flex-start'
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

