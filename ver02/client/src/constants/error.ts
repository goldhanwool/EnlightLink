//SignUP -> graphql error handling
const extractErrorMessage = (err: any) => {
    const errorMessage = err.graphQLErrors;
    if (!errorMessage) {
      return;
    }
    if (Array.isArray(errorMessage)) {
      return errorMessage[0].message;
    } else {
      return errorMessage;
    }
  };
  
  export { extractErrorMessage };