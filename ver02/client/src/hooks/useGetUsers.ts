import { gql, useQuery } from "@apollo/client";

const GET_USERS = gql`
    query GetUsers {
        users{
            _id
        }
    }
`;

const useGetUsers = () => {
    return useQuery(GET_USERS)  
}

export { useGetUsers };