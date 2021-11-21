import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator} from '@react-navigation/drawer';

import Home from '../screens/Home';
import Activity from '../screens/Activity';
import Register from '../screens/Register';
import Login from '../screens/Login';
import Profile from '../screens/Profile';
import PostForm from '../screens/PostForm';
import Search from '../screens/Search';
import { auth } from '../firebase/config';

import firebase from 'firebase';
import { TouchableHighlightBase } from 'react-native';

const Drawer = createDrawerNavigator();

class Menu extends Component{
    constructor(){
        super();
        this.state = {
            error:'',
            userLogued:false,
            user:{}
        }
    }
    
    componentDidMount(){
        auth.onAuthStateChanged(user => {
            if(user!=null){
                this.setState({
                    userLogued:true,
                    user: user,
                })
            }
            console.log(user)
        })

        console.log(this.state.user)
    }

    register(email, pass, username){
        console.log(username)
        auth.createUserWithEmailAndPassword(email, pass)
            .then( ()=>{
                console.log('Registrado');
                this.updateUser(username, 'https://firebasestorage.googleapis.com/v0/b/proyectofinal-native.appspot.com/o/profile.png?alt=media&token=810a4f2f-a3c3-497f-96e4-5d5737b9fda3')
                this.setState({
                    error:'',
                    userLogued:false,
                })
            })
            .catch( error => {
                console.log(error);
                this.setState({
                    error:error.message,
                    userLogued:false,
                })  
            })
    }


    login(email,pass){
        auth.signInWithEmailAndPassword(email,pass)
            .then( response => {
                this.setState({
                    error: '',
                    userLogued: true,
                    user:response.user,
                })
                console.log(response)
            })
            .catch( error => {
                console.log(error);
                this.setState({
                    error:error.message,
                })  
            })
    }

    logout(){
        auth.signOut()
            .then( (res)=>{
                this.setState({
                    user:'',
                    userLogued: false,
                })
            })
            .catch(error=>{
                console.log(error)
                this.setState({
                    error:error.message
                })
            })
        
    }

    updateUser(username, photo){
        console.log(photo)
        const user = firebase.auth().currentUser;
        if(user != null){
            user.updateProfile({
                displayName: username,
                photoURL: photo,
              }).then(() => {
                console.log("yes")
              }).catch((error) => {
                console.log(error)
              });  
        }
        
    }

    render(){
        return(
            
            <NavigationContainer>
            {this.state.userLogued == false ?
                <Drawer.Navigator>
                    <Drawer.Screen name="Registro" component={()=><Register register={(email, pass, username)=>this.register(email, pass, username)} error={this.state.error}/>} />
                    <Drawer.Screen name="Login" component={()=><Login login={(email, pass)=>this.login(email, pass)} error={this.state.error}/>}/>
                </Drawer.Navigator> :
                <Drawer.Navigator>
                    <Drawer.Screen name="Home" component={()=><Home />} />
                    <Drawer.Screen name ="New Post" component={(drawerProps)=><PostForm drawerProps={drawerProps}/>}/>
                    <Drawer.Screen name="Profile" component={()=><Profile userData={this.state.user} logout={()=>this.logout()} updateUser={(name, url)=> this.updateUser(name,url)}/>} />
                    <Drawer.Screen name="Activity" component={()=><Activity  />} />
                    <Drawer.Screen name="Search" component={()=><Search  />} />
                </Drawer.Navigator>
            }
            </NavigationContainer>
        )
    }

}

export default Menu