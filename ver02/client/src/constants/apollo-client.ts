import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

const httpLink = new HttpLink({
    uri: `${process.env.REACT_APP_API_URL}/graphql`,
    credentials: 'include',
})

//GraphQLWsLink 인스턴스 생성: 웹소켓 클라이언트를 생성합니다.
const wsLink = new GraphQLWsLink(
    createClient({
      url: `${process.env.REACT_APP_WS_URL}/graphql`,
    shouldRetry: () => true, // 재시도 여부를 결정하는 함수. 서버 웹소켓 통신이 끓어지면 다시 시도할 수 있게 한다. 
    }),
  )

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' && 
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
)

const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
});

export default client;