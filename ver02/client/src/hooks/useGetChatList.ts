import { gql, useQuery } from "@apollo/client";

export const GET_CHAT_LIST = gql`
    query Chats {
        chats {
            _id
            userId
            originFileName
            filename
            createdAt
        }
    }
`

const useGetChatList = () => {
    return useQuery(GET_CHAT_LIST)
}

export { useGetChatList }