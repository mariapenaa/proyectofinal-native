import React, { Component } from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import { db } from '../firebase/config';
import firebase from 'firebase';

class Post extends Component{
    constructor(props){
        super(props);
        this.state = {
           
        }
    }
    

    render(){
        console.log(this.props);
        return(
            <View style={styles.contanier}>
                <Text>Texto del post: {this.props.postData.data.texto}</Text>
                <Text>user: {this.props.postData.data.owner} </Text>         
            </View>
        )
    }

}


const styles = StyleSheet.create({
    contanier:{
        marginBottom: 20,
        borderRadius:4,
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 10,
    }
})

export default Post

