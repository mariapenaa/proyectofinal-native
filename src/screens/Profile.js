import React, {Component} from "react";
import {View, Text, TextInput, StyleSheet, TouchableOpacity, ImageBackground} from 'react-native';

class Profile extends Component{
    constructor(props){
        super(props)
        this.state={
            
        }
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
                        </View>
                    </View>
                    <TouchableOpacity onPress={()=>this.props.logout()} ><Text>Logout</Text></TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    background:{
        backgroundColor:'pink',
        height:'30vh',
        width:'100%',
    },
    container:{
        width:'100%',
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
        minHeight:'100vh',
        alignItems:'center',
        backgroundColor:'white',
        position:'relative'
    },
    infoContainer:{
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