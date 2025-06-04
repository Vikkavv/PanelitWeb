import { BACKEND_PATH } from "../../App";

export function getFollowers(user){
    async function retrieveApiData() {
        const response = await fetch(BACKEND_PATH+"/Follower/FollowersOfUser/"+user.id);
        const data = await response.json();
        return data;
    }
    return retrieveApiData();
}


export function getFollowed(user){
    async function retrieveApiData() {
        const response = await fetch(BACKEND_PATH+"/Follower/FollowedOfUser/"+user.id);
        const data = await response.json();
        return data;
    }
    return retrieveApiData();
}