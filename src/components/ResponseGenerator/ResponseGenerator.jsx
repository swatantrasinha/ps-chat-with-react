import React, { useRef, useState } from 'react'
import './ResponseGenerator.css'
import defaultImage from '../assets/default-image.png'
import axios from 'axios'

 const ResponseGenerator = () => {
  const [isLoading, setisLoading] = useState(false)
    const inputRef=useRef(null)
    const responseContainerRef = useRef(null)
    const accessToken= process.env.REACT_APP_ACCESS_TOKEN;



    const generateResponse = async () => {
     
        const headers = {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          };
        const data= {
            "message": inputRef?.current?.value,
          "async": false,
            "options": {"model":"gpt4"}
          };
          setisLoading(true);
        axios.post(
            '/api/chat',
            data, 
            { headers })
        .then(res => {
            setisLoading(false);  
            console.log('response is : ', res);
            const msgArray = res.data.data.messages;
            const latestResponse= msgArray[msgArray.length-1]?.content;
            console.log('latestResponse ', latestResponse);

            // DOM Manipulation
            console.log('latestResponse ', latestResponse);
            const responseContainer= responseContainerRef?.current;
            
            // Add query display
            const newQueryContainer = document.createElement('div')
            responseContainer.append(newQueryContainer)
            newQueryContainer.innerHTML= `Query : ${inputRef?.current?.value}`
            newQueryContainer.className = 'query-container';
            
            // Add response display
            const newResponseContainer = document.createElement('div')
            responseContainer.append(newResponseContainer)
            newResponseContainer.innerHTML= latestResponse;
            newResponseContainer.className = 'response-container';
            if(inputRef?.current?.value) {
              inputRef.current.value= '';
            }
        })
        
    }

    const handleSubmit = async (event) => {
      event.preventDefault();
      console.log('inside handleSubmit !!!');
      // const latestResponse= 
      generateResponse();
    }

  return (
    <div className='ai-response-generator'>
    <div className="header">AI Response <span>Generator</span></div>
    <div className="img-loading">
        <div className="image">
            <img src={defaultImage } alt="loader image" />
        </div>
    </div>
    
      <form onSubmit={handleSubmit}>
        <div className="search-box">
          <input type="text" ref={inputRef} placeholder='describe what you wanna search' className="search-input" />
          <input type="submit" className='generate-btn' value="Generate" />
        </div>
      </form>
        
    {isLoading && (<div className="loading-spinner" />)}
    
    <div ref={responseContainerRef}> 

    </div>
    </div>
  )
}
export default ResponseGenerator;