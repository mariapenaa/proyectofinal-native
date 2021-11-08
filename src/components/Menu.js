import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator} from '@react-navigation/drawer';

import Home from '../screens/Home';
import Register from '../screens/Register';
import Login from '../screens/Login';
import Profile from '../screens/Profile';
import PostForm from '../screens/PostForm';
import { auth } from '../firebase/config';

import firebase from 'firebase';
import { TouchableHighlightBase } from 'react-native';

const Drawer = createDrawerNavigator();

class Menu extends Component{
    constructor(){
        super();
        this.state = {
            userLogued:false,
            user:{}
        }
    }
    
    componentDidMount(){
        auth.onAuthStateChanged(user => {
            this.setState({
                userLogued:true,
                user: user,
            })
        })

        console.log(this.state.user)
    }

    register(email, pass, username){
        console.log(username)
        auth.createUserWithEmailAndPassword(email, pass)
            .then( ()=>{
                console.log('Registrado');
                this.updateUser(username, null)
            })
            .catch( error => {
                console.log(error);
            })
    }


    login(email,pass){
        auth.signInWithEmailAndPassword(email,pass)
            .then( response => {
                this.setState({
                    userLogued: true,
                    user:response.user,
                })
                console.log(response)
            })
            .catch(e => console.log(e))
    }

    logout(){
        auth.signOut()
            .then( (res)=>{
                this.setState({
                    user:'',
                    userLogued: false,
                })
            })
            .catch()
        
    }

    updateUser(username, photo){
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
                    <Drawer.Screen name="Registro" component={()=><Register register={(email, pass, username)=>this.register(email, pass, username)} />} />
                    <Drawer.Screen name="Login" component={()=><Login login={(email, pass)=>this.login(email, pass)} />}/>
                </Drawer.Navigator> :
                <Drawer.Navigator>
                    <Drawer.Screen name="Home" component={()=><Home />} />
                    <Drawer.Screen name ="New Post" component={(drawerProps)=><PostForm drawerProps={drawerProps}/>}/>
                    <Drawer.Screen name="Profile" component={()=><Profile userData={this.state.user} logout={()=>this.logout()} />} />
                </Drawer.Navigator>
            }
            </NavigationContainer>
        )
    }

}

export default Menu