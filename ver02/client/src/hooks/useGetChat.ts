import { gql, useQuery } from "@apollo/client";

const GET_CHAT_DOCUMENT = gql`
    query Chat($chatId: String!) {
        chat(chatId: $chatId) {
            _id
            userId
            originFileName
            filename
            imageUrl
            createdAt
        }
    }
`;

const useGetChat = (chatId: string) => {
    return useQuery(GET_CHAT_DOCUMENT, {
        variables: { chatId: chatId }
    });
}

export { useGetChat };