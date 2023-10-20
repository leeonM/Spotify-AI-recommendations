import { useEffect, useState } from 'react'


const API_KEY=process.env.REACT_APP_OPEN_AI_API_KEY

const openAiUrl = "https://api.openai.com/v1/completions"


type Image = {
    url: string;
}

type Artist = {
    external_urls: {
        spotify: string;
    },
    followers: {
        total: number;
    },
    genres: string[],
    id: string,
    images: Image[],
    name: string
}

type ArtistIdType = string

const CLIENT_ID=process.env.REACT_APP_CLIENT_ID
const CLIENT_SECRET=process.env.REACT_APP_CLIENT_SECRET


const SearchSpotify = () => {
    const [search, setSearch] = useState<string>("")
    const [play, setPlay] = useState<Artist>()
    const [artistId, setArtistId] = useState<ArtistIdType>("")
    const [playAi, setPlayAi] = useState<string>("")
    const [accessToken, setAccessToken] = useState<string>("")

    var authParams = {
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "grant_type=client_credentials&client_id="+ CLIENT_ID +"&client_secret="+CLIENT_SECRET
      }

      var artistParams = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer "+accessToken
        }
      }

      useEffect(() => {
        fetch("https://accounts.spotify.com/api/token", authParams)
        .then(result => result.json())
        .then(data=> setAccessToken(data.access_token))
    // eslint-disable-next-line
    }, [])
    
    const callOpenAIAPI = async ()=>{
        const APIBody = {
            "model": "gpt-3.5-turbo-instruct",
            "prompt": "Provide the name of "+search,
            "max_tokens": 7,
            "temperature": 0,
          }
    
          await fetch(openAiUrl, {
            method: "POST",
            headers: {
            'Content-Type': 'application/json',
            "Authorization": 'Bearer '+ API_KEY 
            },
            body: JSON.stringify(APIBody)
          })
          .then(response => response.json())
          .then(data=>setPlayAi(data.choices[0].text))
      }

    useEffect(() => {
        if (playAi) {
            const getArtistId = async () => {
                await fetch("https://api.spotify.com/v1/search?q="+playAi+"&type=artist", artistParams)
                  .then(result => result.json())
                  .then(data=> setArtistId(data.artists.items[0].id))
                  setSearch("")
              }
              getArtistId()
        }
    // eslint-disable-next-line
    }, [playAi])
    
    useEffect(() => {
    if (artistId) {
        const getArtist = async () => {
            await fetch("https://api.spotify.com/v1/artists/"+artistId, artistParams)
              .then(result => result.json())
              .then(data =>(setPlay(data)))
          }
          getArtist()
    }
    // eslint-disable-next-line
    }, [artistId])


  return (
    <div className='flex flex-col items-center justify-center mt-16'>
        <div className='w-[70%] sm:w-[60%] md:w-[50%] flex justify-center mb-4'>
        <textarea value={search} rows={5} cols={33}
        placeholder='Recommend an artist from a specific location, who makes a genre you are looking for, a decade they are from or a subgenre of music'
        onChange={(e)=>setSearch(e.target.value)}
        className='w-[100%] p-4 rounded-l-md outline-none text-black'
        >
        </textarea>
        <button onClick={callOpenAIAPI} className='rounded-r-md p-2 bg-[#1DB954] text-black font-bold text-sm'>Submit</button>
        </div>
 
        {(play) ? <div className='my-4 flex flex-col gap-2 p-2 text-white'>
            <div>
                <img alt={play.name} src={play.images[0].url} 
            className='h-[300px] w-[300px] rounded-md'
            />
             <h1 className='text-3xl'>{play.name}</h1>
            <p> <strong>Followers:</strong> {play.followers.total}</p>
            {play.genres.map((genre:any,index:number)=>(
                <p key={index}>{genre}</p>
            ))}
            <a href={play.external_urls.spotify} rel="noreferrer" target="_blank" 
            className='text-[#1DB954]'>
             Link to Spotify</a>
            </div>
        </div> : null}
        
        </div>
  
  )
}

export default SearchSpotify