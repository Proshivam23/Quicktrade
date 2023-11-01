function validation(values) {
    let error = {};
    const email_pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (values.email.trim() === "") {
        error.email = "Email should not be empty";
    } else if (!email_pattern.test(values.email)) {
        error.email = "Email did not match";
    } else {
        error.email = ""; // Clear the error message if the email is valid
    }

    return error;
}




export default validation