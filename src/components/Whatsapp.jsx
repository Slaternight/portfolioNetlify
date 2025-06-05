import { FloatingWhatsApp } from 'react-floating-whatsapp'
import pictureMineChat from "../assets/profile/ft.png";

export default function Whatsapp() {

  return (
      <FloatingWhatsApp
        phoneNumber="+573208441575"
        accountName="Slayder"
        // initialMessageByServer="Hi there!🖖 How can I assist you today? 🫡"
        // initialMessageByClient="Hello! 🖐️ I found your contact on your website 🖥️. I would like to chat with you about..."  
        chatMessage="Hi there!🖖 How can I assist you today? 🫡"
        statusMessage="Available right now" // "Available", "Busy", "Away", "Offline"
        placeholder = "Tell me whatever you want.."
        allowEsc={true}
        allowClickAway
        notification={true}
        notificationSound
        avatar={pictureMineChat}
        darkMode="true"
         />
  )
}