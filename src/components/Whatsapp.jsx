import { FloatingWhatsApp } from 'react-floating-whatsapp'
import pictureMineChat from "../assets/profile/ft.png";

export default function Whatsapp() {

  return (
      <FloatingWhatsApp
        phoneNumber="+573208441575"
        accountName="Slayder"
        allowEsc
        allowClickAway
        notification
        notificationSound
        avatar={pictureMineChat}
         />
  )
}