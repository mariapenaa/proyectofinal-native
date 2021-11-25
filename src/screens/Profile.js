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
            changedName:'',
            date:''
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
            this.convertDate()
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

    convertDate(){
        let date = new Date(this.props.userData.metadata.lastSignInTime)
        let day = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear() 
        let hours = date.getHours()
        let minutes = date.getMinutes()
        if(month < 10){
            this.setState({
                date:  `${day}-0${month}-${year} a las ${hours}:${minutes}`
            })
        
          }else{
              this.setState({
                  date: `${day}-${month}-${year} a las ${hours}:${minutes}`
              })
          }
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
                            <Text style={styles.boldText}> Última vez conectado fue el </Text> <Text style={styles.secondText}>{this.state.date}</Text>
                            <Text style={styles.boldText}> Número de posteos:</Text> <Text style={styles.secondText}> {this.state.posteos.length} </Text>
                            <View style={styles.inline}>
                                <TouchableOpacity style={styles.logout} onPress={()=>this.props.logout()} ><Text style={styles.texto}>Logout</Text></TouchableOpacity>
                                <TouchableOpacity style={styles.editProfile} onPress={()=>this.showModal(true)} ><Text style={styles.texto}>Editar perfil</Text></TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={styles.profilePosts}>
                        {this.state.posteos.length===0 ? 
                           <Text  style={{fontWeight: "bold"}}>No has posteado nada aún</Text> : 
                           <React.Fragment>
                               <Text  style={{fontWeight: "bold"}}>Mis posteos</Text>
                               <FlatList 
                                   style={{
                                       width: '100%',
                                   }}
                                   contentContainerStyle={styles.listContainer}
                                   data= { this.state.posteos }
                                   keyExtractor = { post => post.id.toString()}
                                   renderItem = { ({item}) => <Post postData={item} />} 
                                   />
                           </React.Fragment>}
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
    inline:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-around',
        width:'80%',
        marginTop:10,
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
        alignItems: 'center',
        width:'70%'
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
        position:'relative',
        height:'45vh',
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
        border: '1px solid ',
        borderRadius: '4%',
        paddingLeft: '2.5%',
        backgroundColor: '#2b1e49',
        paddingHorizontal: 8,
        paddingVertical: '0.5rem',
        textAlign: 'center',
        marginBottom:'0.4rem',
        borderRadius:4, 
        fontSize:'1rem',
        boxShadow:'0px 6px 16px 0px rgba(0,0,0,0.37);'
    
    },
    editProfile: {
        width: '40%',
        border: '1px solid ',
        borderRadius: '4%',
        paddingLeft: '2.5%',
        backgroundColor: '#2b1e49',
        paddingHorizontal: 8,
        paddingVertical: '0.5rem',
        textAlign: 'center',
        marginBottom:'0.4rem',
        borderRadius:4, 
        fontSize:'1rem',
        boxShadow:'0px 6px 16px 0px rgba(0,0,0,0.37);'
    },
    texto: {
        fontWeight:'200',
        color: 'white'
    },
})

export default Profile;