import { gql, useMutation } from '@apollo/client';

const REMOVE_CHAT = gql`
    mutation RemoveChat($chatId: String!) {
        removeChat(chatId: $chatId) {
            _id
        }
    }
`;

const useRemoveChat = (chatId: string) => {
    return useMutation(REMOVE_CHAT, {
        variables: { chatId },
        update(cache, { data }) {
            if (data?.removeChat) {
                // Assuming "chats" is the query you might have to store all chats
                cache.modify({
                    fields: {
                        //"existingChatsRefs"(or whatever you name it): represents the current state of the chats field in the cache.
                        //"readField" is a helper function provided by Apollo to read fields from referenced cache objects safely.
                        chats(existingChatsRefs, { readField }) {
                            return existingChatsRefs.filter(
                                (chatRef: any) => readField('_id', chatRef) !== data.removeChat._id
                            );
                        }
                    }
                });
                //chatId에 연결된 메시지들도 삭제
                const existingMessages = cache.readQuery({
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
                    variables: { chatId: chatId }
                });

                if (existingMessages) {
                    cache.writeQuery({
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
                        variables: { chatId: chatId },
                        data: {
                            messages: []
                        }
                    });
                }
            }
        },
        onError(err) {
            // Handle error appropriately
            console.error('Failed to remove chat:', err);
        }
    });
}

export { useRemoveChat };
