import { useEffect, useState } from 'react'

const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let options = {
        headers
      }

const API_KEY=process.env.REACT_APP_OPEN_AI_API_KEY


const openAiUrl = "https://api.openai.com/v1/completions"

type Tag = {
    name: string;
}

type Mix = {
    audio_length: number;
    comment_count: number;
    created_time: string;
    favourite_count: number;
    key: string;
    name: string;
    play_count: number;
    repost_count: number;
    url: string;
    user: {
        name: string;
        username: string;
    }
    tags: Tag[];
}

type Oembed = {
    html: string;
}

type Choices = {
    text: string;
}


const Search = () => {
    const [search, setSearch] = useState<string>("")
    const [play, setPlay] = useState<Mix[]>([])
    const [playAi, setPlayAi] = useState<string>("")
    const [mix, setMix] = useState<string>("")
    const [oEmbed, setOEmbed] = useState<Oembed>()
    const url = `https://api.mixcloud.com/search/?q=${playAi}&type=cloudcast`


    const handleSubmit = async () => {
        await fetch(url, options).then(response => response.json())
        .then(data=>setPlay(data.data))
    }


    const callOpenAIAPI = async ()=>{
        const APIBody = {
            "model": "gpt-3.5-turbo-instruct",
            "prompt": 'Recommend a artist who makes '+search,
            "max_tokens": 7,
            "temperature": 0
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
          await fetch(url, options).then(response => response.json())
         .then(data=>setPlay(data.data))
         await fetch(url, options).then(response => response.json())
        .then(data=>setPlay(data.data))
          setSearch("")
      }

   

    const handleMix = (index:number) => {
        setMix(`https://app.mixcloud.com/oembed/?url=${play[index].url}`)
    }

    useEffect(() => {
       const getOembed = async () => {
        await fetch(mix,options).then(response => response.json())
        .then(data=>setOEmbed(data))
       }
       getOembed()
    }, [mix])

    const oEmbedSrc = oEmbed?.html.split(`"`)[5]

    console.log(playAi.split('.'[1]))
    

  return (
    <div className='flex flex-col items-center justify-center mt-16'>
        <div className='w-[70%] sm:w-[60%] md:w-[50%] flex justify-center mb-4'>
        <textarea id="search" name="search" value={search} rows={5} cols={33}
        placeholder='Recommend an artist who makes...and find mixes they are in'
        onChange={(e)=>setSearch(e.target.value)}
        className='w-[100%] p-4 rounded-l-md outline-none'
        >
        </textarea>
        <button onClick={callOpenAIAPI} className='rounded-r-md p-2 bg-slate-600 text-white font-bold text-sm'>Submit</button>
        </div>
        <div>
        {playAi && <p>Finding {playAi}</p>}
        </div>
        <div className='m-6 w-[40%]'>
        {oEmbed && <iframe title='mixPlayer' width="100%" height="120" src={oEmbedSrc}></iframe>}
        </div>
        <div className='my-4 flex flex-col gap-2 border-2 p-2'>
            {play && play.map((mix:Mix,index)=>(
                <div className='cursor-pointer gap-2 border-2 rounded-md p-1 hover:bg-slate-600 hover:text-white' key={index}
                onClick={()=>handleMix(index)}
                >
                    <p>{mix.name}</p>
                    <div className='flex gap-4'>
                    <p><span className='font-semibold'>Username: </span>{mix.user.username}</p>
                    <p><span className='font-semibold'>Plays: </span>{mix.play_count}</p>
                    {mix.tags.length ? <p className='flex'><span className='font-semibold flex mr-2'>Tags: </span>{mix.tags.map((tag,index)=>(<p key={index} className='flex mr-2'>{tag.name}</p>))}</p>: null}
                    <p><span className='font-semibold'>Length: </span>{(mix.audio_length / 60).toFixed(2)} minutes</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Search
