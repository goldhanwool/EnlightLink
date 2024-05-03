import { gql, useMutation } from "@apollo/client"

interface MessagesQueryData {
    messages: Message[];
}

interface Message {
    _id: string;
    chatId: string;
    content: string;
    userId: string;
    userType: string;
    createdAt: Date;
}

const CREATE_MESSAGE = gql`
    mutation CreateMessage($createMessageInput: CreateMessageInput!) {
        createMessage(createMessageInput: $createMessageInput) {
            _id
            chatId
            userId
            content
            createdAt
            userType
        }
    }
`

const useCreateMessage = (chatId: string) => {
    return useMutation(CREATE_MESSAGE, {
        update(cache, {data}) {
            //You use readQuery and writeQuery when your operation involves reading a whole query's data,
            const existingMessages = cache.readQuery<MessagesQueryData>({
                query: gql`
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
                `,
                variables: { chatId },
            })
            if (!existingMessages || !data?.createMessage) return;
            
            cache.writeQuery<MessagesQueryData>({
                query: gql`
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
                `,
                variables: { chatId },
                data: {
                    messages: [...existingMessages.messages, data.createMessage]
                }
            })
        }
    })
}

export { useCreateMessage }