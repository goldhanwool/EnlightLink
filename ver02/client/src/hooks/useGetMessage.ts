import { gql, useQuery } from "@apollo/client";

const GET_MESSAGE_DOCUMENT = gql`
    query Messages($chatId: String!) {
        messages(chatId: $chatId) {
            _id
            chatId
            userId
            content
            createdAt
            userType
        }
    }
`;

const useGetMessage = (chatId: string) => {
    return useQuery(GET_MESSAGE_DOCUMENT, {
        variables: { chatId: chatId }
    });
}

export { useGetMessage };
