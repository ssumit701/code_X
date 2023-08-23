import bot from "./assets/bot.svg"
import user from "./assets/user.svg"


const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval=0;

function loader(element) {
  element.textContent = "  ";
  loadInterval = setInterval(() => {
    element.textContent += ".";
     
    if (element.textContent === '....') {
      element.textContent = " ";
    }

  }, 300)

}
function typetext(element,text)
{
  let index=0;
  let interval=setInterval(()=>{
    if(index<text.length)
    {
      element.innerHTML+=text.charAt(index);
      index++;
    }else{
      clearInterval(interval)
    }

  },20)
}
function generateUniqueId()
{
  const timestamp=Date.now();
  const randomNumber=Math.random();
  const hexaDexcimalNumber=randomNumber.toString(16)
  return `id- ${timestamp}-${hexaDexcimalNumber}`
}

function chatStripe(isAi,value,uniqueId)
{
  return(
 
`     <div class="wrapper ${isAi && 'ai'}" >
         <div class='chat'>
          <div class='profile'>
            <img 
                    src="${isAi ?bot:user}"
                    alt="${isAi ?'bot':'user'}"           
            
            />
          </div>
          <div class='message' id='${uniqueId}'>${value}</div>
         </div>
     </div>
 ` 
  )
}
const handleSubmit =async (e)=>{
       e.preventDefault()
const data=new FormData(form);

       //userStripe
       chatContainer.innerHTML+=chatStripe(false,data.get('prompt'))
       form.reset()
       // botstripe
       const uniqueId=generateUniqueId()
       chatContainer.innerHTML+=chatStripe(true," ",uniqueId);
        
       chatContainer.scrollTop=chatContainer.scrollHeight

      const messagediv=document.getElementById(uniqueId)

        
     loader(messagediv);
     const response = await fetch('http://localhost:5000',{
      method :'POST',
      headers:{
         'Content-Type':'application/json'
      },
      body:JSON.stringify({
        prompt:data.get('prompt')
      })
     })      
     clearInterval(loadInterval)
     messagediv.innerHTML=" "
     if(response.ok)
     {
      const data =await response.json();
      const parseData=data.bot.trim();
    typetext(messagediv,parseData) 
    }else{
      const err=await response.text();
      messagediv.innerHTML='something went wrong'
      alert(err);
    }
}
form.addEventListener('submit',handleSubmit)
form.addEventListener('keyup',(e)=>{
  if(e.keyCode===13)
  {
    handleSubmit(e)
  }
})