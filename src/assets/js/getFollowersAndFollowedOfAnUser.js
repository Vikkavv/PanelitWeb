export function getFollowers(user){
    async function retrieveApiData() {
        const response = await fetch("http://localhost:8080/Follower/FollowersOfUser/"+user.id);
        const data = await response.json();
        return data;
    }
    return retrieveApiData();
}


export function getFollowed(user){
    async function retrieveApiData() {
        const response = await fetch("http://localhost:8080/Follower/FollowedOfUser/"+user.id);
        const data = await response.json();
        return data;
    }
    return retrieveApiData();
}