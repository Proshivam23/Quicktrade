function Validation(values){
    let error ={}
    const email_pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const password_pattern = /^[A-Za-z]\w{7,14}$/;


    if(values.name === ""){
        error.name = "Name can not be empty"
    }
    else{
        error.name = " "
    }

    if(values.email === ""){
        error.email = "Email can not be empty"
    }
    else if(!email_pattern.test(values.email)){
        error.email ="Email did not match"
    }
    else{
        error.email = " "
    }

    if(values.password === ""){
        error.password = "Password should not be empty"
    }
    else if(!password_pattern.test(values.password)){
        error.password ="Password should have numeric values"
    }
    else{
        error.password = " "
    }
    
    if(values.confirmpassword !== values.password){
        error.confirmpassword = "Password not matching"
    }
    else{
        error.confirmpassword = " "
    }
    return error;
}

export default Validation