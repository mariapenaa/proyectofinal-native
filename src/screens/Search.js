import React, {Component} from 'react';
import {Text, TouchableOpacity, View, StyleSheet, Image, ActivityIndicator, FlatList, TextInput} from 'react-native';
import { db, auth } from '../firebase/config';
import Post from '../components/Post';


class Search extends Component{
  constructor(props){
    super(props);
    this.state ={
      search: '',
    }
  }

  search(input){
      console.log(input)
      db.collection('posts').orderBy('owner').startAt(input.toLowerCase()).endAt(input + '\uf8ff').onSnapshot(
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
            search: posts,
          })
        }
      )
  }
 

  render(){
    return(
      <View style={styles.container}>
           <Text style={styles.title}>Search</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(input)=> this.search(input)}
                    placeholder='Buscá los posteos de un usuario'
                    keyboardType='default'/>
            {this.state.search.length == 0 ? 'No hay posteos de este usuario' :
            <FlatList 
                contentContainerStyle={styles.postContainer}
                data= { this.state.search }
                keyExtractor = { post => post.id}
                renderItem = { ({item}) => <Post postData={item} />} 
            />
            }
      </View>
      )
  }
}

const styles = StyleSheet.create({
  container:{
    overflowY:'scroll',
    display:'flex',
    flexDirection:'column',
    padding:'3rem',
    minHeight:'100vh',
  },
  title:{
    fontSize:'2rem',
    color:'#2b1e49',
    paddingBottom:'2rem',
    fontWeight:'bold'
},
input:{
    height:20,
    padding:'1.4rem',
    borderWidth:1,
    borderColor: '#ccc',
    borderStyle: 'solid',
    borderRadius: 6,
    marginVertical:10,

},
})

export default Search;