import React, {Component} from 'react';
import {Text, TouchableOpacity, View, StyleSheet, Image, ActivityIndicator, FlatList, TextInput} from 'react-native';
import { db, auth } from '../firebase/config';
import Post from '../components/Post';


class Home extends Component{
  constructor(props){
    super(props);
    this.state ={
      posteos: [],
      showAlert:true,
    }
  }
  componentDidMount(){
    db.collection('posts').orderBy('createdAt','desc').onSnapshot(
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

  render(){
    return(
      <View style={styles.container}>
        <FlatList 
          contentContainerStyle={styles.postContainer}
          data= { this.state.posteos }
          keyExtractor = { post => post.id.toString()}
          renderItem = { ({item}) => <Post postData={item} />} 
        />
      </View>
      )
  }
}

const styles = StyleSheet.create({
  container:{
    overflowY:'scroll'
  }
})

export default Home;