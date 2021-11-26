import React, { Component } from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image, Modal, FlatList, Alert, TextPropTypes } from 'react-native';
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
           showAlert:false,
           display:true,
        }
    }
    componentDidMount(){
        console.log(this.props)

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

    showModal(show){
        this.setState({
            showModal: show ? true : false,
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
            })
            this.setState({
                comment: '',
                comments:this.state.comments +1,
            })
        })
    }

    toggleAlert(show){
        console.log(show)
        this.setState({
            showAlert:show,
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
              this.toggleAlert(false);
              this.setState({
                  display:false,
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
        if(this.state.display){
            return(
                <View style={styles.container} blurRadius={1}>
                   <View style={styles.userInfo}>
                        <View style={styles.user}>
                            <Text style={styles.userMain}>@{this.props.postData.data.ownerName ? this.props.postData.data.ownerName : ''} </Text> 
                            <Text style={styles.userSecond}>{this.props.postData.data.owner} </Text> 
                        </View>
                        { this.props.postData.data.owner === auth.currentUser.email ? 
                        <TouchableOpacity onPress={() => this.toggleAlert(true)}><Icon name='trash-outline' width={30} height={30} fill='red'></Icon> </TouchableOpacity> : <Text></Text>} 
                    </View>
                    <View style={styles.imgContainer}>
                        {this.props.postData.data.photo ? 
                        <Image 
                        style={styles.photo}
                        source={{uri:this.props.postData.data.photo}}/> : <Text></Text>}
                    </View>
                    <View style={styles.actionContainer}>
                        <View style={styles.actionLine}>
                            {this.state.myLike === false ? 
                            <View style={styles.actionLine}><TouchableOpacity onPress={()=> this.darLike()}> <Icon name='heart-outline' width={30} height={30}/></TouchableOpacity><Text style={styles.subText}>{this.state.likes}</Text></View>:
                            <View style={styles.actionLine}><TouchableOpacity onPress ={()=> this.sacarLike()}><Icon name='heart' width={30} height={30} fill="red"/></TouchableOpacity><Text style={styles.subText}>{this.state.likes}</Text></View>}      
                            <TouchableOpacity onPress={()=> this.showModal(true)}><Icon name='message-circle-outline' width={30} height={30} /></TouchableOpacity><Text style={styles.subText}>{this.state.comments}</Text>
                            <Text style={styles.userSecond}> {this.state.date}</Text>
                        </View>
                        <View style={styles.textoPost}><Text>{this.props.postData.data.texto}</Text></View>
                    </View>
                    {this.state.showModal ?
                    
                        <Modal  visible={this.state.showModal} animationType='fade' transparent={true} avoidKeyboard={true}>
                       
                            <View style={styles.modal}>
                                <View style={styles.modalView}>
                                    <View style={styles.cross}>
                                        <TouchableOpacity onPress={()=> this.showModal(false)} ><Icon name='close-outline' width={30} height={30} ></Icon></TouchableOpacity>
                                    </View>
                                    <FlatList
                                    data={this.props.postData.data.comments}
                                    keyExtractor={ comment =>comment.createdAt.toString()}
                                    renderItem={ ({item}) => <View style={styles.flatlist}><Text>  <Icon name={'message-circle-outline'} width={15} height={15}></Icon>  {item.author}:  {item.text}</Text> </View>}/> 
                                    <View style={styles.comment}>  
                                        <Text>{this.state.comments===0 ? 'No hay comentarios aun': ''}</Text>
                                        <TextInput placeholder="Agregá un comentario..." style={styles.input} keyboardType="default" multiline onChangeText={(text)=> this.setState({ comment: text })} value={this.state.comment} /> 
                                        <TouchableOpacity style={this.state.comment == '' ? styles.buttonComentarDisabled : styles.buttonComentar } onPress={()=> this.guardarComentario()} disabled={this.state.comment == '' ? true: false}> <Text style={styles.buttonText}>Guardar Comentario</Text> </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal> : <Text></Text> }
                        {this.state.showAlert ?
                    
                    <Modal  visible={this.state.showAlert} animationType='fade' transparent={true} avoidKeyboard={true}>
                   
                        <View style={styles.modal}>
                            <View style={styles.modalView}>
                                <Text>¿Estás seguro de que deseas continuar?</Text>
                                <View style={styles.buttonDisplayInline}>
                                    <TouchableOpacity style={styles.buttonComentarDisabled} onPress={()=>this.toggleAlert(false)}><Text>Cancelar</Text></TouchableOpacity>
                                    <TouchableOpacity style={styles.buttonRed} onPress={()=>this.deletePost()}><Text>Eliminar</Text></TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal> : <Text></Text> }
                </View>
            )

        }else{
            return(
            <View></View>
        )

         }
            
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
    flatlist:{
        width:'100%',
        marginBottom: '4%',
        borderTop: '1px dotted black'
    },
    modal:{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1, 
        width: '100%'
    },
    modalView:{
        backgroundColor: 'white',
        width: '100%'
    },
    cross:{
        display:'flex',
        justifyContent:'flex-end',
        flexDirection:'row',
        width:'100%',
        marginBotton: '2%'
    },
    buttonText:{
        color:'white'
    },
    comment:{
        marginTop: '3%',
        width: '90%'
    },
    input:{
        padding:'1.4rem',
        borderRadius: 6,
        marginVertical:10,
        border: "1px solid pink",
        overflowY:'hidden'
    },
    photo:{
        flex:1
    },
    imgContainer: {
        width:'100%',
        flex:4,
        marginTop: '2%'
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
    buttonDisplayInline:{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around'
    },
    userMain:{
        fontSize:16,
    },
    userSecond:{
        fontSize:13,
        color:'grey'
    },
    actionContainer:{
        flex:1,
        marginTop: '2%'
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
        justifyContent:'flexEnd',
        padding: 15,
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
    buttonComentar:{
            backgroundColor:'#2b1e49',
            paddingHorizontal: 10,
            paddingVertical: '0.7rem',
            textAlign: 'center',
            marginTop:'2rem',
            marginBottom:'1.4rem',
            borderRadius:4, 
            fontSize:'1rem',
            boxShadow:'0px 6px 16px 0px rgba(0,0,0,0.37);',
            color:'white'
    },
    buttonRed:{
        backgroundColor:'red',
        paddingHorizontal: 10,
        paddingVertical: '0.7rem',
        textAlign: 'center',
        marginTop:'2rem',
        marginBottom:'1.4rem',
        borderRadius:4, 
        fontSize:'1rem',
        boxShadow:'0px 6px 16px 0px rgba(0,0,0,0.37);',
        color:'white'
},
    buttonComentarDisabled:{
        backgroundColor:'grey',
        color:'white',
        paddingHorizontal: 10,
        paddingVertical: '0.7rem',
        textAlign: 'center',
        marginTop:'2rem',
        marginBottom:'1.4rem',
        borderRadius:4, 
        fontSize:'1rem',
        boxShadow:'0px 6px 16px 0px rgba(0,0,0,0.37);'
    },
    textoPost:{
        marginTop: '3%'
    }

})

export default Post

