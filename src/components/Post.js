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
           comments:0,
           date: '',
        }
    }
    componentDidMount(){
        console.log(this.props.postData)

            this.setState({
                likes: this.props.postData.data.likes ? this.props.postData.data.likes.length : 0,
                comments: this.props.postData.data.comments ? this.props.postData.data.comments.length : 0,
                myLike: this.props.postData.data.likes ? this.props.postData.data.likes.includes(auth.currentUser.email) : false,
            })
            this.convertDate()
        
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

    deletePost(){
        db.collection('posts').where('createdAt','==',this.props.postData.data.createdAt)
        .onSnapshot(
            docs => {
              console.log(docs);
              //Array para crear datos en formato más útil.
              docs.forEach( doc => {
                doc.ref.delete()
              })
            }
          ) 

    }
    convertDate(){
        let date = new Date(this.props.postData.data.createdAt)
        let day = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear() 

        if(month < 10){
            this.setState({
                date:  `${day}-0${month}-${year}`
            })
        
          }else{
              this.setState({
                  date: `${day}-${month}-${year}`
              })
          }
    }

    render(){
        console.log(this.state)
        return(
            <View style={styles.container}>
               <View style={styles.userInfo}>
                    <View style={styles.user}>
                        <Text style={styles.userMain}>@{this.props.postData.data.ownerName ? this.props.postData.data.ownerName: ''} </Text> 
                        <Text style={styles.userSecond}>{this.props.postData.data.owner} </Text> 
                    </View>
                    {this.props.postData.data.owner == auth.currentUser.email ? 
                    <TouchableOpacity onPress={() => this.deletePost()}><Icon name='trash-outline' width={30} height={30} fill='red'></Icon> </TouchableOpacity> : ''} 
                </View>
                <View style={styles.imgContainer}>
                    {this.props.postData.data.photo ? 
                    <Image 
                    style={styles.photo}
                    source={{uri:this.props.postData.data.photo}}/> : <Text></Text>}
                </View>
                <View style={styles.actionContainer}>
                    <View style={styles.actionLine}>
                        {this.state.myLike == false ? 
                        <><TouchableOpacity onPress={()=> this.darLike()}> <Icon name='heart-outline' width={30} height={30}/></TouchableOpacity><Text style={styles.subText}>{this.state.likes}</Text></>:
                        <><TouchableOpacity onPress ={()=> this.sacarLike()}><Icon name='heart' width={30} height={30} fill="red"/></TouchableOpacity><Text style={styles.subText}>{this.state.likes}</Text></>}      
                        <TouchableOpacity onPress={()=> this.showModal()}><Icon name='message-circle-outline' width={30} height={30} /></TouchableOpacity><Text style={styles.subText}>{this.state.comments}</Text>
                        <Text style={styles.userSecond}> {this.state.date}</Text>
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
                                    <TouchableOpacity style={this.state.comment == '' ? styles.buttonComentarDisabled : styles.buttonComentar } onPress={()=> this.guardarComentario()} disabled={this.state.comment == '' ? true: false}> <Text>Guardar Comentario</Text> </TouchableOpacity>
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
    userInfo:{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between'
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

    },
    buttonComentar:{
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
    buttonComentarDisabled:{
        backgroundColor:'grey',
        paddingHorizontal: 10,
        paddingVertical: '0.7rem',
        textAlign: 'center',
        marginTop:'2rem',
        marginBottom:'1.4rem',
        borderRadius:4, 
        fontSize:'1rem',
        boxShadow:'0px 6px 16px 0px rgba(0,0,0,0.37);'
},
    
})

export default Post

