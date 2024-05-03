import { gql, useMutation } from '@apollo/client'

const CREATE_CHAT = gql`
    mutation CreateChat($createChatInput: CreateChatInput!) {
        createChat(createChatInput: $createChatInput) {
            _id
            userId
            targetId
            originFileName
            filename
            createdAt
            imageUrl
        }
    }
`

const useCreateChat = () => {
    return useMutation(CREATE_CHAT, {
        update(cache, { data }) { //apollo cache update
            const newChatRef = cache.writeFragment({
                data: data.createChat,
                fragment: gql`
                    fragment NewChat on Chat {
                        _id
                        userId
                        originFileName
                        filename
                        imageUrl
                        createdAt
                    }
                `
            });
            cache.modify({
                fields: {
                    chats(existingChats = []) {
                        console.log('[[useCreateChat]] > newChatRef: ', newChatRef);
                        return [...existingChats, newChatRef];
                    }
                }
            });
        }
    });
};

export { useCreateChat }