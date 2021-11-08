import React, {Component} from "react";
import {View, Text, TextInput, StyleSheet, TouchableOpacity} from 'react-native';

class Login extends Component{
    constructor(props){
        super(props)
        this.state={
            email:'',
            userName:'',
            password:'',
            error:''
        }
    }
    
    // Deprecado por inclusión de Firebase
    // onSubmit(){
    //     console.log(`El email ingresado es: ${this.state.email}`);
    //     console.log(`El usuario ingresado es: ${this.state.userName}`);
    //     console.log(`La contraseña ingresada es: ${this.state.password}`);
    // }

    render(){
        return(
            <View style={styles.formContainer}>
                <Text style={styles.title}>Login</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(text)=>this.setState({email: text})}
                    placeholder='email'
                    keyboardType='email-address'/>
                <TextInput
                    style={styles.input}
                    onChangeText={(text)=>this.setState({password: text})}
                    placeholder='password'
                    keyboardType='email-address'
                    secureTextEntry={true}
                />
                <Text style={styles.error}>{this.props.error}</Text>
                <TouchableOpacity style={styles.button} onPress={()=>this.props.login(this.state.email, this.state.password)} >
                    <Text style={styles.textButton}>Loguearse</Text>    
                </TouchableOpacity>
                <Text style={styles.redirect}>¿Todavía no tenes una cuenta? <Text style={styles.span}>Registrate.</Text></Text>
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
    error:{
        color:'red',
    }

})

export default Login;