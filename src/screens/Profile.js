import React, {Component} from "react";
import Post from '../components/Post';
import { db } from '../firebase/config';
import firebase from 'firebase';
import { auth } from '../firebase/config';
import {View, Text, TextInput, Image, StyleSheet, TouchableOpacity, ImageBackground, FlatList, Modal} from 'react-native';
import MyCamera from '../components/MyCamera';
import { Icon } from 'react-native-eva-icons';

class Profile extends Component{
    constructor(props){
        super(props)
        this.state={
            posteos : [],
            showModal:false,
            showCamera: false,
            url: '',
            displayName:'',
            changedName:''
        }
    }

    componentDidMount(){
        console.log(auth.currentUser)
            db.collection('posts').where("owner", "==", auth.currentUser.email).onSnapshot(
              docs => {
                console.log(docs);
                //Array para crear datos en formato más útil.
                let posts = [];
                docs.forEach( doc => {
                  posts.push({
                    id: doc.id,   
                    data: doc.data(),
                  })
                })
                console.log(posts);
        
                this.setState({
                    posteos: posts,
                    displayName:auth.currentUser.displayName,
                    changedName:auth.currentUser.displayName,
                    url:auth.currentUser.photoURL
                })
              }
            )
    }

    showModal(show){
        this.setState({
            showModal: show ? true : false,
        })
    }



    onUserChange(user){
        this.setState({
            displayName:user
        }, ()=>this.props.updateUser(this.state.displayName, this.state.url))
    }

    onImageUpload(url){
        this.setState({
            showCamera: false,
            url:url,
        }, ()=>this.props.updateUser(this.state.displayName, this.state.url))
    }


    render(){
        const image = { uri: '/assets/gradient.jpg' }
        console.log(this.props.userData)
        return(
            <View style={styles.main}>
                        <View style={styles.imgView}>
                            {this.props.userData.photoURL != (null && undefined && '') ?  
                                <Image 
                                    style={styles.photo}
                                    source={{uri:this.props.userData.photoURL}}/>: <Text></Text>}
                        </View>
                <ImageBackground source={require('../../assets/gradient.jpg')} resizeMode="cover" style={styles.background}> </ImageBackground>
                <View style={styles.container}>
                    <View style={styles.infoContainer}>
                        <View style={styles.textContainer}>
                            <Text style={styles.mainText}>{this.props.userData.displayName}</Text>
                            <Text style={styles.secondText}>{this.props.userData.email}</Text>
                            <Text style={styles.boldText}> Last signed in:</Text> <Text style={styles.secondText}>{this.props.userData.metadata.lastSignInTime}</Text>
                            <Text style={styles.boldText}> Number of posts:</Text> <Text style={styles.secondText}> {this.state.posteos.length} </Text>
                            <TouchableOpacity style={styles.logout} onPress={()=>this.props.logout()} ><Text style={styles.texto}>Logout</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.editProfile} onPress={()=>this.showModal(true)} ><Text style={styles.texto}>Edit profile</Text></TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.profilePosts}>
                        <Text  style={{fontWeight: "bold"}}>Mis posteos</Text>
                        <FlatList 
                            style={{
                                width: '100%',
                            }}
                            contentContainerStyle={styles.listContainer}
                            data= { this.state.posteos }
                            keyExtractor = { post => post.id}
                            renderItem = { ({item}) => <Post postData={item} />} 
                            />
                        </View>
                </View>
                {this.state.showModal ?
                    <Modal  visible={this.state.showModal} animationType='fade' transparent={true}>
                       <View style={styles.container}>
                            <View style={styles.modalView}>
                                <View style={styles.cross}>
                                        <TouchableOpacity onPress={()=>{this.showModal(false)}} ><Icon name='close-outline' width={30} height={30} ></Icon></TouchableOpacity>
                                </View>
                            <Text>Cambiá tu nombre de usuario</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={(text)=>this.setState({changedName: text})}
                                placeholder='Escribí aquí'
                                keyboardType='default'
                                multiline
                                value={this.state.changedName}    
                            />
                              <TouchableOpacity style={styles.button} onPress={()=>{this.onUserChange(this.state.changedName)} }><Text>Guardar cambios usuario</Text></TouchableOpacity> 
                              {this.state.showCamera ? <MyCamera onImageUpload={(url)=> {this.onImageUpload(url)}} style={{ flex: 1 }}/>:
                              <TouchableOpacity style={styles.button} onPress={()=> this.setState({ showCamera: true})}><Text>Agregar Foto</Text></TouchableOpacity> }
                            </View>
                        </View>
                    </Modal> : <Text></Text> }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    listContainer:{
        flex:1,
        alignItems:'center'
    },
    cross:{
        display:'flex',
        justifyContent:'flex-end',
        flexDirection:'row',
        width:'100%'
    },
    input:{
        padding:'1.4rem',
        borderWidth:1,
        borderColor: '#ccc',
        borderStyle: 'solid',
        borderRadius: 6,
        marginVertical:10,
    },
    button:{
        backgroundColor:'#8fa7ef',
        paddingHorizontal: 10,
        paddingVertical: 6,
        textAlign: 'center',
        borderRadius:4, 
        borderWidth:1,
        borderStyle: 'solid',
        borderColor: '#28a745',
        marginBottom:10,
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
        elevation: 5,
        width: '80%',
        height:'65vh',
        marginRight:50,
      },
    background:{
        backgroundColor:'pink',
        height:'33vh',
        width:'100%',
    },
    profilePosts:{
        paddingHorizontal:30,
        alignItems: 'center'
    },
    photo: {
                borderRadius:'50%',
        width:130,
        height:130,
        flex:1,
        zIndex:10,
        elevation:10
    },
    container:{
        width:'110%',
        position:'absolute',
        top:'18vh',
        alignItems: 'center'
    },
    textContainer:{
        position:'absolute',
        top:100,
        alignItems: 'center'
    },
    main:{
        display:'flex',
        width:'100%',
        flex:1,
        alignItems:'center',
        backgroundColor:'white',
        position:'relative',
        overflow:'hidden',
        overflowY:'scroll',
    },
    infoContainer:{
        overflowX:'hidden',
        overflowY:'scroll',
        display:'flex',
        alignItems:'center',
        width:'100%',
        backgroundColor:'white',
        borderRadius:'100%',
        width:'100%',
        position:'relative',
        height:'40vh',
        zIndex:10,
    },
    mainText:{
        display:'flex',
        justifyContent:'center'
    },
    secondText:{
        display:'flex',
        justifyContent:'center'
    },
    boldText:{
        display:'flex',
        justifyContent:'center',
        fontWeight:'bold',
    },
    imgView:{
        borderRadius:'50%',
        width:130,
        zIndex:10,
        height:130,
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        top:'10%'
    },
    logout:{
        width: '40%',
        border: '1px solid pink',
        borderRadius: '4%',
        paddingLeft: '2.5%',
        marginTop: '10%',
        backgroundColor: 'pink',
    
    },
    editProfile: {
        width: '40%',
        border: '1px solid pink',
        borderRadius: '4%',
        paddingLeft: '2.5%',
        marginTop: '10%',
        marginTop: '2%',
        backgroundColor: 'pink',
    },
    texto: {
        fontWeight:'200'
    },
})

export default Profile;