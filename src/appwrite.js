import { Client, Databases, ID, Query } from 'appwrite'

const DATA_BASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const client = new Client()
.setEndpoint('https://nyc.cloud.appwrite.io/v1')
.setProject(PROJECT_ID);
const databases = new Databases(client)
export const updateSearchCount = async(serchTerm,movie)=>{
    // Is to use appwrite sdk or api check if the document already exist in the database
    try {
        const result = await databases.listDocuments(DATA_BASE_ID, COLLECTION_ID,[
            Query.equal('serchTerm', serchTerm)
        ]);
        if(result.documents.length >0){
            const doc = result.documents[0];
            await databases.updateDocument(DATA_BASE_ID, COLLECTION_ID, doc.$id,{
                count: doc.count + 1
            }); 
        }
        else{
            await databases.createDocument(DATA_BASE_ID,COLLECTION_ID,ID.unique(),{
                serchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url:`https://image.tmdb.org/t/p/original/${movie.poster_path}`
            })
        }
    }
    catch (error) {
        console.log(error);
    }
    // If it does, update the search count
    // If it doesn't, create a new document with search count 1
}
export const getTrendingMovies = async() =>{
    try {
        const result = await databases.listDocuments(DATA_BASE_ID, COLLECTION_ID,[
            Query.orderDesc('count'),
            Query.limit(5)
        ]);
        return result.documents;
    } catch (error) {
        console.log(error);
        return [];
    }
}