import React, {Component} from "react";
import {View, Text, TextInput, StyleSheet, TouchableOpacity} from 'react-native';

class Register extends Component{
    constructor(props){
        super(props)
        this.state={
            email:'',
            username:'',
            password:'',
            error:'',
        }
    }

    componentDidMount(){
        
    }

    render(){
        return(
            <View style={styles.formContainer}>
                <Text style={styles.title}>Register</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(text)=>this.setState({email: text})}
                    placeholder='email'
                    keyboardType='email-address'/>
                <TextInput
                    style={styles.input}
                    onChangeText={(text)=>this.setState({username: text})}
                    placeholder='user name'
                    keyboardType='default'/>
                <TextInput
                    style={styles.input}
                    onChangeText={(text)=>this.setState({password: text})}
                    placeholder='password'
                    keyboardType='email-address'
                    secureTextEntry={true}
                />
                <Text style={styles.error}>{this.props.error}</ Text>
                <TouchableOpacity style={this.state.email == '' || this.state.username == '' || this.state.password == '' ? styles.buttonDisabled : styles.button} 
                onPress={()=>this.props.register(this.state.email, this.state.password, this.state.username)} 
                disabled={this.state.email == '' || this.state.username == '' || this.state.password == '' ? true : false}>
                    <Text style={styles.textButton}>Registrarse</Text>    
                </TouchableOpacity>
                <Text style={styles.redirect}>¿Ya tienes una cuenta? 
                <TouchableOpacity onPress={()=> this.props.drawerProps.navigation.navigate('Login')}><Text style={styles.span} >Logueate.</Text></TouchableOpacity></Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    formContainer:{
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
    button:{
        backgroundColor:'#2b1e49',
        paddingHorizontal: 10,
        paddingVertical: '0.7rem',
        textAlign: 'center',
        marginTop:'2rem',
        marginBottom:'1.4rem',
        borderRadius:4, 
        fontSize:'1rem',
        boxShadow:'0px 6px 16px 0px rgba(0,0,0,0.37);'
    },
    buttonDisabled:{
        backgroundColor:'grey',
        paddingHorizontal: 10,
        paddingVertical: '0.7rem',
        textAlign: 'center',
        marginTop:'2rem',
        marginBottom:'1.4rem',
        borderRadius:4, 
        fontSize:'1rem',
        boxShadow:'0px 6px 16px 0px rgba(0,0,0,0.37);'
    },
    textButton:{
        color: '#fff'
    },
    redirect: {
        fontSize:'0.8rem',
        display:'flex',
        justifyContent:'center'
    },
    span: {
        color:'#2b1e49',
    },
    error: {
        color:'red'
    }

})

export default Register;