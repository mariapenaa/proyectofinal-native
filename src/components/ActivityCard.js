import React, { Component } from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image, Modal, FlatList} from 'react-native';
import { db } from '../firebase/config';
import firebase from 'firebase';
import { auth } from '../firebase/config';
import { TextInput } from 'react-native-gesture-handler';
import { Icon } from 'react-native-eva-icons';

class ActivityCard extends Component{
    constructor(props){
        super(props);
        this.state = {
            message:'',
            icon:'loader-outline',
            loaded:false,
        }
    }
    componentDidMount(){
       switch (this.props.data.data.type) {
           case 'comment':
               this.setState({
                   loaded:true,
                   icon:'message-circle-outline',
                   message:`${this.props.data.data.owner} commentó "${this.props.data.data.comment}" en la publicación de ${this.props.data.data.postBy}`
               })
               break;
            case 'like':
                this.setState({
                    loaded:true,
                    icon:'heart-outline',
                    message:`${this.props.data.data.owner} likeó la publicación de ${this.props.data.data.postBy}`
                });
                console.log('like'+ this.state.message)
                break;
            case 'unlike':
                this.setState({
                    loaded:true,
                    icon:'close-circle-outline',
                    message:`${this.props.data.data.owner} deslikeó la publicación de ${this.props.data.data.postBy}`
                })
                break;
            case 'post':
                this.setState({
                    loaded:true,
                    icon:'upload-outline',
                    message:`${this.props.data.data.owner} subió un nuevo post`
                })
                break;
           default:
               break;
       }
    }
    
    render(){
        console.log(this.state)
        return(
                <View style={styles.container}>
                     <Icon name={this.state.icon} width={30} height={30}/>
                    <Text style={styles.text}>{this.state.message}</Text>
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
        display:'flex',
        flexDirection:'row'
    },
    text:{
        marginLeft:10,
    },
    bold:{
        fontWeight:'bold'
    }
})

export default ActivityCard

