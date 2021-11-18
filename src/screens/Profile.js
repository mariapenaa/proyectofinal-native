import React, {Component} from "react";
import Post from '../components/Post';
import { db } from '../firebase/config';
import firebase from 'firebase';
import { auth } from '../firebase/config';
import {View, Text, TextInput, StyleSheet, TouchableOpacity, ImageBackground, FlatList, Modal} from 'react-native';

class Profile extends Component{
    constructor(props){
        super(props)
        this.state={
            posteos : [],
            showModal:false,
        }
    }

    componentDidMount(){
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
                })
              }
            )
    }

    showModal(){
        this.setState({
            showModal: true,
        })
    }


    render(){
        const image = { uri: '/assets/gradient.jpg' }
        console.log(this.props.userData)
        return(
            <View style={styles.main}>
                <ImageBackground source={require('../../assets/gradient.jpg')} resizeMode="cover" style={styles.background}> </ImageBackground>
                <View style={styles.container}>
                    <View style={styles.infoContainer}>
                        <View style={styles.imgView}></View>
                        <View style={styles.textContainer}>
                            <Text style={styles.mainText}>{this.props.userData.displayName}</Text>
                            <Text style={styles.secondText}>{this.props.userData.email}</Text>
                            <Text style={styles.secondText}> Last signed in: {this.props.userData.metadata.lastSignInTime}</Text>
                            <Text style={styles.secondText}> Number of posts: {this.state.posteos.length} </Text>
                            <TouchableOpacity onPress={()=>this.props.logout()} ><Text>Logout</Text></TouchableOpacity>
                            <TouchableOpacity onPress={()=>this.showModal()} ><Text>Edit profile</Text></TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.profilePosts}>
                        <Text>Mis posteos</Text>
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
    background:{
        backgroundColor:'pink',
        height:'33vh',
        width:'100%',
    },
    profilePosts:{
        paddingHorizontal:30,
    },
    container:{
        width:'110%',
        position:'absolute',
        top:'18vh'
    },
    textContainer:{
        position:'absolute',
        top:100
    },
    main:{
        display:'flex',
        width:'100%',
        flex:1,
        alignItems:'center',
        backgroundColor:'white',
        position:'relative',
        overflow:'hidden',
        overflowY:'scroll'
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
        height:'30vh'
    },
    mainText:{
        display:'flex',
        justifyContent:'center'
    },
    secondText:{
        display:'flex',
        justifyContent:'center'
    },
    imgView:{
        borderRadius:'50%',
        width:130,
        height:130,
        border:'solid black',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        top:'-50px'
    }
})

export default Profile;