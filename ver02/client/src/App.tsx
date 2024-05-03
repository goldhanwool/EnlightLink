import { ApolloProvider } from "@apollo/client";
import client from "./constants/apollo-client";
import Guard from "./component/guard/Guard";
import { RouterProvider } from "react-router-dom";
import { router } from "./component/Routes";
import { SimpleSnackbar } from "./component/snackVar/SnackVar";
import { CssBaseline, Grid } from "@mui/material";
import ChatList from "./component/chat/list/ChatList";
import { usePath } from "./hook/usePath";


const App = () => {
  const { path } = usePath();
  const showChatList = path.includes('/chats');

  return (
    <ApolloProvider client={client}>
      <CssBaseline />
      <Guard>
          { showChatList ? (
            <Grid container sx={{position: 'fixed'}}>
              <Grid item xs={0} sm={2} md={2} xl={2} sx={{display: { xs: 'none', sm: 'flex' }}}>
                <ChatList />
              </Grid>
              <Grid item xs={12} sm={10} md={10} xl={10}> 
                <Routes />
              </Grid>
            </Grid>
          ) : ( 
            <Routes />
          )
          }
      </Guard>
      <SimpleSnackbar />
    </ApolloProvider>
  );
}

const Routes = () => {
  return (
      <RouterProvider router={router} />
  )
}

export default App;
