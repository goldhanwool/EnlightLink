import { gql, useSubscription } from "@apollo/client";

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

const MESSAGE_CREATED = gql`
    subscription MessageCreated($chatId: String!) {
        messageCreated(chatId: $chatId) {
            _id
            chatId
            userId
            content
            createdAt
            userType
        }
    }
`

export const useMessageCreated = (chatId: string) => {
    return useSubscription(MESSAGE_CREATED, {
        variables: { chatId },
        onSubscriptionData: ({ subscriptionData: { data }, client }) => {
            if (data?.messageCreated) {
                const messagesQueryOptions = {
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
                        }`,
                    variables: {
                        chatId: data.messageCreated.chatId,
                    },
                };
                const existingMessages = client.cache.readQuery<MessagesQueryData>(messagesQueryOptions);
                if (existingMessages) {
                    client.cache.writeQuery({
                        ...messagesQueryOptions,
                        data: {
                            messages: [...existingMessages.messages, data.messageCreated],
                        },
                    });
                }
            }
        }
    }) //end of useSubscription
}