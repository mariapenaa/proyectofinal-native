import React, {Component} from 'react';
import {Text, TouchableOpacity, View, StyleSheet, Image, ActivityIndicator, FlatList, TextInput} from 'react-native';
import { db, auth } from '../firebase/config';
import ActivityCard from '../components/ActivityCard';


class Activity extends Component{
  constructor(props){
    super(props);
    this.state ={
      activity : []
    }
  }
  componentDidMount(){
    db.collection('activity').orderBy('createdAt','desc').onSnapshot(
      docs => {
        console.log(docs);
        //Array para crear datos en formato más útil.
        let activity = [];
        docs.forEach( doc => {
          activity.push({
            id: doc.id,   
            data: doc.data(),
          })
        })
        console.log(activity);

        this.setState({
          activity: activity,
        })
      }
    )
  }


  render(){
    return(
      <View style={styles.container}>
        <FlatList 
          data= { this.state.activity }
          keyExtractor = { act => act.id.toString()}
          renderItem = { ({item}) => <ActivityCard data={item} />} 
        />
      </View>
      )
  }
}

const styles = StyleSheet.create({
  container:{
   

  }
})

export default Activity;